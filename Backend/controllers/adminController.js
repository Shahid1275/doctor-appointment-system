import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorsModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter valid email" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // Create doctor data
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    // Save doctor to database
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor added successfully",
    });
  } catch (error) {
    console.error("Error in addDoctor:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API for admin login
const adminLogin = async (req, res) => {
  // Added req and res parameters
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        success: true,
        token,
        message: "Admin login successful",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.error("Error in adminLogin:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//api to display all appointments in admin panel
const adminAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//api for cancel an apointment
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if already cancelled
    if (appointment.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    // Update appointment status
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { cancelled: true, status: "cancelled" },
      { new: true }
    );

    // Release doctor slot
    const { docId, slotDate, slotTime } = appointment;
    await doctorModel.findByIdAndUpdate(docId, {
      $pull: { [`slots_booked.${slotDate}`]: slotTime },
    });

    res.json({
      success: true,
      message: "Appointment cancelled",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// api for adminn dashboard
const adminDashboard = async (req, res) => {
  try {
    const users = await userModel.find({});
    const doctors = await doctorModel.find({});
    const appointments = await appointmentModel.find({});

    const dashboardData = {
      patients: users.length,
      doctors: doctors.length,
      appointments: appointments.length,
      latestAppointments: appointments.slice(0, 5).reverse(),
    };

    res.json({
      success: true,
      message: "Admin dashboard data",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export {
  addDoctor,
  adminLogin,
  allDoctors,
  adminAppointments,
  appointmentCancel,
  adminDashboard,
};
