# SnapShare: Photo-Sharing App Scaling Plan

## 1. Assumptions

The system has 10 million registered users, and 10% of them are active each day.

This gives the application 1 million daily active users.

Each active user uploads one photo per day and views 50 feed pages per day.

Each original photo has an average size of 2 MB, while each generated thumbnail has an average size of 50 KB.

For the initial estimates, I assume that every daily active user uploads exactly one photo and views exactly 50 feed pages per day. I also assume 30 days per month and 365 days per year.

## 2. Traffic and Storage Estimates

### Daily Photo Uploads

There are 1 million daily active users, and each uploads one photo per day.

1,000,000 × 1 = 1,000,000 photo uploads per day.

### Uploads Per Second

There are 86,400 seconds in a day.

1,000,000 ÷ 86,400 = 11.57 uploads per second.

The system therefore handles approximately 12 photo uploads per second on average.

### Daily Feed Views

Each active user views 50 feed pages per day.

1,000,000 × 50 = 50,000,000 feed views per day.

### Average Feed Views Per Second

50,000,000 ÷ 86,400 = 578.7.

The system handles approximately 579 feed views per second on average.

### Peak Feed Views Per Second

Peak traffic is estimated at 5 times the average traffic.

579 × 5 = 2,895 feed views per second.

### Annual Photo Storage

Each day, the system receives 1 million original photos of 2 MB each.

1,000,000 × 2 MB = 2,000,000 MB per day.

Each photo also generates a 50 KB thumbnail.

1,000,000 × 50 KB = 50,000,000 KB = 50,000 MB per day.

Total daily storage:

2,000,000 MB + 50,000 MB = 2,050,000 MB.

Annual storage:

2,050,000 MB × 365 = 748,250,000 MB.

This is approximately 748.25 TB per year, including original photos and thumbnails, using decimal storage units.

These estimates exclude additional storage overhead, backups, replicas, and future user growth.

## 3. Read-Heavy or Write-Heavy System?

SnapShare is a read-heavy system because users view feed pages much more frequently than they upload photos.

The system receives 50 million feed views per day compared to 1 million photo uploads per day. This means feed views are 50 times more frequent than uploads.

The architecture should therefore prioritise fast data retrieval and photo delivery.

A Content Delivery Network (CDN) can serve photos closer to users, reducing loading times and requests reaching the main servers. A cache can store frequently requested feed data to reduce repeated database queries. A database read replica can handle read requests separately from the primary database, reducing pressure on it.

The system should also use a load balancer to distribute incoming requests across multiple application servers.

## 4. Photo Storage

Photos should not be stored directly inside the database because image files are large and would increase the database size. This could make database backups, maintenance, and queries more expensive and resource-intensive.

Instead, SnapShare should use object storage to store original photos and their thumbnails. Examples include Amazon S3, Azure Blob Storage, and Google Cloud Storage.

The database should store photo metadata, such as the photo ID, user ID, upload date, and the object's storage location or key. When a user requests a photo, the application can use this information to retrieve the image from object storage.

This separation allows the database to manage structured information efficiently while object storage handles large image files.

## 5. System Architecture

                         USERS
                           |
                           v
                         CDN
                           |
                           v
                    LOAD BALANCER
                           |
                           v
                 APPLICATION SERVERS
                    /      |       \
                   /       |        \
                  v        v         v
               CACHE    DATABASE   OBJECT STORAGE
                          |
                          v
                     READ REPLICA

UPLOAD PROCESS:

USERS
  |
  v
CDN (for photo delivery)
  |
  v
LOAD BALANCER
  |
  v
APPLICATION SERVERS
  |
  +------> OBJECT STORAGE (original photo)
  |
  +------> QUEUE
               |
               v
             WORKER
               |
               v
          OBJECT STORAGE
          (thumbnail)
               |
               v
          DATABASE
       (photo metadata and
        thumbnail location)

## 6. Components and Their Responsibilities

1. **CDN (Content Delivery Network):** Delivers photos and thumbnails from servers closer to users, reducing loading times and traffic reaching the main application.

2. **Load Balancer:** Distributes incoming requests across multiple application servers to prevent one server from becoming overloaded.

3. **Application Servers:** Handle application logic, process user requests, manage photo uploads, and communicate with other system components.

4. **Cache:** Stores frequently requested feed data temporarily so the application does not need to retrieve the same information repeatedly from the database.

5. **Primary Database:** Stores structured information such as user details, photo metadata, captions, and relationships between users.

6. **Database Read Replica:** Maintains a copy of the primary database and handles read requests, reducing the workload on the primary database.

7. **Object Storage:** Stores original photos and generated thumbnails separately from the database, allowing large image files to be stored and retrieved efficiently.

8. **Queue:** Holds thumbnail-generation tasks until a worker is ready to process them, preventing image processing from delaying the upload response.

9. **Thumbnail Worker:** Processes queued jobs in the background, creates smaller versions of uploaded photos, and saves the thumbnails in object storage.

## 7. Photo Upload Flow

1. A user selects a photo and submits it through the SnapShare application.

2. The upload request reaches the load balancer, which forwards it to an available application server.

3. The application server validates the photo's file type, size, and the user's permission to upload.

4. The application server stores the original photo in object storage and receives its storage key.

5. The application server saves the photo's metadata, including the photo ID, user ID, upload date, and object storage key, in the primary database.

6. The application server sends a thumbnail-generation task to the queue.

7. A background worker retrieves the task from the queue and creates a smaller thumbnail of approximately 50 KB.

8. The worker saves the thumbnail in object storage and updates the database with the thumbnail's storage key.

9. The photo and its thumbnail can now be delivered to users through the CDN when requested.

Using a queue and background worker allows thumbnail processing to happen separately from the main upload request. This prevents users from having to wait for image processing to finish before the application acknowledges their upload.

## 8. Architecture Trade-offs

### 1. CDN vs Cost and Cache Freshness

Using a CDN improves photo delivery speed and reduces traffic reaching the main servers. However, CDN services introduce additional costs, and cached content may need to be invalidated when photos are updated or deleted.

### 2. Cache vs Data Consistency

Caching frequently requested feed data improves performance and reduces database queries. However, cached information may become outdated when users upload new photos or change their follow relationships. The application must update or invalidate the cache when relevant data changes.

### 3. Read Replica vs Data Replication Delay

Using a read replica reduces the workload on the primary database and supports high reading traffic. However, changes made to the primary database may take some time to appear on the replica. This means users may occasionally see slightly outdated information.

### 4. Asynchronous Thumbnail Processing vs Processing Delay

Using a queue and background worker allows photo uploads to be acknowledged without waiting for thumbnail generation. However, thumbnails may not be immediately available because jobs must wait in the queue and be processed by a worker. The system must also handle failed jobs and retry processing when necessary.

