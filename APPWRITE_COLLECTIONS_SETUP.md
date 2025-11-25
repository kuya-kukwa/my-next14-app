# Appwrite Database Collections Setup

## Overview
You need to create 5 collections in your Appwrite Database. Each collection needs specific attributes (fields) and permissions.

## Step-by-Step Instructions

### 1. Open Appwrite Console
1. Go to https://nyc.cloud.appwrite.io/console
2. Select your project: **Nextflix**
3. Click **Databases** in the left sidebar
4. Click on your database (`691b43f60034245eb14b`)

### 2. Create Collections

For each collection below, click **"Create Collection"** button and follow the attribute setup.

---

## Collection 1: `users`

**Collection Settings:**
- **Collection ID**: `users` (type this manually)
- **Collection Name**: `users`

**Attributes** (click "+ Create Attribute" for each):

| Attribute Key | Type     | Size | Required | Default |
|---------------|----------|------|----------|---------|
| `appwriteId`  | String   | 100  | ✅ Yes   | -       |
| `email`       | String   | 255  | ✅ Yes   | -       |
| `createdAt`   | DateTime | -    | ✅ Yes   | -       |

**Permissions:**
- Read: `Any`
- Create: `Any`
- Update: `Any`
- Delete: `Any`

*Note: You can tighten permissions later. For now, use "Any" for testing.*

**Indexes** (optional but recommended):
- Index on `appwriteId` (unique)
- Index on `email` (unique)

---

## Collection 2: `profiles`

**Collection Settings:**
- **Collection ID**: `profiles`
- **Collection Name**: `profiles`

**Attributes:**

| Attribute Key | Type     | Size | Required | Default |
|---------------|----------|------|----------|---------|
| `userId`      | String   | 100  | ✅ Yes   | -       |
| `displayName` | String   | 255  | ❌ No    | null    |
| `avatarUrl`   | String   | 1024 | ❌ No    | null    |
| `bio`         | String   | 5000 | ❌ No    | null    |

**Permissions:**
- Read: `Any`
- Create: `Any`
- Update: `Any`
- Delete: `Any`

**Indexes:**
- Index on `userId` (unique)

---

## Collection 3: `movies`

**Collection Settings:**
- **Collection ID**: `movies`
- **Collection Name**: `movies`

**Attributes:**

| Attribute Key | Type     | Size | Required | Default |
|---------------|----------|------|----------|---------|
| `title`       | String   | 255  | ✅ Yes   | -       |
| `category`    | String   | 255  | ❌ No    | null    |
| `genre`       | String   | 255  | ❌ No    | null    |
| `year`        | Integer  | -    | ❌ No    | null    |
| `rating`      | Float    | -    | ❌ No    | null    |
| `image`       | String   | 1024 | ❌ No    | null    |
| `thumbnail`   | String   | 1024 | ❌ No    | null    |
| `createdAt`   | DateTime | -    | ✅ Yes   | -       |

**Permissions:**
- Read: `Any`
- Create: `Any`
- Update: `Any`
- Delete: `Any`

**Indexes:**
- Index on `category`
- Index on `title` (for search)

---

## Collection 4: `favorites`

**Collection Settings:**
- **Collection ID**: `favorites`
- **Collection Name**: `favorites`

**Attributes:**

| Attribute Key | Type     | Size | Required | Default |
|---------------|----------|------|----------|---------|
| `userId`      | String   | 100  | ✅ Yes   | -       |
| `movieId`     | Integer  | -    | ✅ Yes   | -       |
| `createdAt`   | DateTime | -    | ✅ Yes   | -       |

**Permissions:**
- Read: `Any`
- Create: `Any`
- Update: `Any`
- Delete: `Any`

**Indexes:**
- Index on `userId`
- Index on `movieId`

---

## Collection 5: `contact_messages`

**Collection Settings:**
- **Collection ID**: `contact_messages`
- **Collection Name**: `contact_messages`

**Attributes:**

| Attribute Key | Type     | Size | Required | Default |
|---------------|----------|------|----------|---------|
| `name`        | String   | 255  | ✅ Yes   | -       |
| `email`       | String   | 255  | ✅ Yes   | -       |
| `subject`     | String   | 255  | ❌ No    | null    |
| `message`     | String   | 5000 | ✅ Yes   | -       |
| `createdAt`   | DateTime | -    | ✅ Yes   | -       |

**Permissions:**
- Read: `Any`
- Create: `Any`
- Update: `Any`
- Delete: `Any`

---

## Quick Tips

### Creating Attributes
1. Click **"+ Create Attribute"**
2. Choose attribute type (String, Integer, Float, DateTime)
3. Enter key name exactly as shown in tables above
4. Set size (for String types)
5. Check/uncheck "Required"
6. Click "Create"
7. Wait for attribute to be "Available" (status shows in collection dashboard)

### Creating Indexes
1. Go to collection **"Indexes"** tab
2. Click **"+ Create Index"**
3. Enter index key (e.g., `appwriteId_index`)
4. Select attribute to index
5. Choose "Unique" if specified
6. Click "Create"

### Setting Permissions
1. Go to collection **"Settings"** tab
2. Scroll to **"Permissions"** section
3. For testing, add permission:
   - **Role**: `Any`
   - **Permissions**: Check all (Read, Create, Update, Delete)
4. Click "Update"

---

## After Creating Collections

Once all 5 collections are created with their attributes, come back to VS Code and I'll:
1. Migrate your existing Postgres data to Appwrite
2. Remove Prisma dependencies
3. Test the app to ensure everything works

Let me know when you've finished creating the collections!
