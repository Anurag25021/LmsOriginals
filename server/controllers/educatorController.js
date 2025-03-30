import { clerkClient } from '@clerk/express';
import { v2 as cloudinary } from 'cloudinary';
import Course from '../models/Course.js';

// Update Role to Educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: { role: 'educator' }
        });

        res.status(200).json({ success: true, message: "You can publish a course" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add New Course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'Thumbnail not attached' });
        }

        let parsedCourseData;
        try {
            parsedCourseData = JSON.parse(courseData);
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid course data format' });
        }

        parsedCourseData.educator = educatorId;

        // Upload image first to avoid partial course creation
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        if (!imageUpload.secure_url) {
            return res.status(500).json({ success: false, message: 'Image upload failed' });
        }

        parsedCourseData.courseThumbnail = imageUpload.secure_url;

        // Create course only after successful image upload
        const newCourse = await Course.create(parsedCourseData);

        res.status(201).json({ success: true, message: 'Course added successfully', course: newCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
