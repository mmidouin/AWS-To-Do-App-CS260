# My To-Do App

This guide provides step-by-step instructions for setting up and hosting the **my-todo-app** React project on **AWS S3**.  

## Prerequisites

Before you begin, ensure that you have the following:  
- **An AWS account** to host your React app on an S3 bucket.  
- **Node.js** installed on your local machine.  
- **npm (Node Package Manager)** installed.  

---

## Step 1: Download and Extract the Project

1. Download the `.zip` file of this repository.  
2. Extract the `.zip` file to a preferred directory on your local machine.  
3. Open a terminal and navigate to the extracted folder:

   - **Windows (PowerShell):**
     ```powershell
     cd path\to\my-todo-app
     ```
   - **Mac/Linux (Terminal):**
     ```bash
     cd /path/to/my-todo-app
     ```

---

## Step 2: Verify Node.js and npm Installation

Before proceeding, check if **Node.js** and **npm** are installed.

- To check the Node.js version, run:
  ```bash
  node -v
  ```

- To check the npm version, run:
  ```bash
  npm -v
  ```

If Node.js is not installed, download and install it from the [official website](https://nodejs.org/).

---

## Step 3: Install Dependencies

Once inside the project folder, install all required dependencies by running:

```bash
npm install
```

This will download and install all necessary packages for the React project.

---

## Step 4: Build the React Project

To generate the production-ready files, run:

```bash
npm run build
```

This command will create a `dist/` folder inside the project directory.
Inside the `dist/` folder, you will find an `index.html` file and an `assets` folder containing static files.

---

## Step 5: Host the React App on AWS S3

### 1. Create an S3 Bucket:
1. Log in to the AWS Management Console.
2. Navigate to S3 under Services.
3. Click Create bucket.
4. Provide a unique bucket name (e.g., my-todo-app-bucket).
5. Select a region.
6. Uncheck "Block all public access" if you want to make your site publicly accessible.
7. Click Create bucket.

### 2. Upload Build Files to S3:
1. Open the newly created S3 bucket.
2. Click Upload.
3. Select all files from the `dist/` folder, including:
   - `index.html`
   - The entire `assets/` folder.
4. Click Upload to store the files in the bucket.

### 3. Enable Static Website Hosting:
1. In the S3 bucket, go to the Properties tab.
2. Scroll down to Static website hosting.
3. Click Edit, enable Static website hosting, and choose "Host a static website."
4. Set `index.html` as the default document.
5. Save the changes.

### 4. Make Files Public:

To allow users to access the hosted website, you need to make the files publicly accessible:
1. Navigate to the Permissions tab.
2. Scroll down to the Bucket policy section.
3. Click Edit and add the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

4. Replace `your-bucket-name` with the actual name of your S3 bucket.
5. Click Save changes.

---

## Step 6: Configure API Endpoints

Once you have configured your API routes and connected your database via AWS Lambda, update the API URL in the `TodoList.jsx` file.
- Open `src/components/TodoList.jsx`.
- Locate the commented-out section:
  ```javascript
  // API_URL = ""
  ```
- Replace the empty string with your API endpoint.
- Rebuild the project and redeploy to AWS S3 to ensure the changes take effect
---

## Step 7: Access Your Hosted React App

Once your S3 bucket is configured for static hosting, you can access your my-todo-app via the S3 Bucket Website URL found under Static website hosting settings.

---

### 🎉 Congratulations!

You have successfully built and deployed my-todo-app on AWS S3.

---
