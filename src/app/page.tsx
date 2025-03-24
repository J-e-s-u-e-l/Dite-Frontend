"use client";
import Head from "next/head";
import { motion } from "framer-motion";
import { FaBook, FaComments, FaTasks, FaBell } from "react-icons/fa";

export default function LandingPage() {
  const primaryGreen = "#16a34a"; // Primary theme color
  const darkGreen = "#14532d"; // Darker shade for gradients
  const lightGreen = "#f0fdf4"; // Light complementary color

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Button hover animation
  // const buttonHover = {
  //   hover: { scale: 1.05, transition: { duration: 0.3 } },
  // };

  const buttonHover = {
    hover: {
      scale: 1.05,
      backgroundColor: primaryGreen, // Changes to #16a34a on hover
      color: lightGreen, // Changes to #f0fdf4 on hover
      transition: { duration: 0.3 },
    },
  };

  // Card hover animation
  const cardHover = {
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Head>
        <title>Dite - Coursework Support System</title>
        <meta
          name="description"
          content="Streamline your academic journey with Dite"
        />
      </Head>

      {/* Navbar */}
      <nav
        style={{ backgroundColor: primaryGreen }}
        className="text-white py-4 px-6 sticky top-0 z-50 shadow-md"
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dite</h1>
          <div className="flex space-x-6 items-center">
            <a href="#about" className="hover:text-[${lightGreen}] transition">
              About
            </a>
            <a
              href="#features"
              className="hover:text-[${lightGreen}] transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[${lightGreen}] transition"
            >
              How It Works
            </a>
            <a
              href="\login"
              className="px-4 py-2 rounded-full border border-white hover:bg-white hover:text-[#16a34a] transition"
            >
              Login
            </a>
            <a
              href="\register"
              // style={{ backgroundColor: lightGreen, color: primaryGreen }}
              // className="px-4 py-2 rounded-full font-semibold bg-gray-200 text-[#16a34a] hover:bg-[#16a34a] hover:text-white hover:border-solid  transition"
              className="px-4 py-2 rounded-full border border-white hover:bg-white hover:text-[#16a34a] transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          background: `linear-gradient(to right, ${primaryGreen}, ${darkGreen})`,
        }}
        className="text-white py-20"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Empower Your Learning Journey with Dite
          </motion.h1>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl mb-8"
          >
            A streamlined platform for coursework organization, collaboration,
            and academic success.
          </motion.p>
          <div className="space-x-4">
            <motion.a
              href="/register"
              variants={buttonHover}
              whileHover="hover"
              initial={{ backgroundColor: lightGreen, color: primaryGreen }} // Initial state
              className="px-6 py-3 rounded-full font-semibold"
            >
              Get Started
            </motion.a>

            <motion.a
              href="#features"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              style={{ borderColor: lightGreen, color: lightGreen }}
              className="border px-6 py-3 rounded-full font-semibold hover:bg-[rgba(255,255,255,0.1)] transition"
            >
              Learn More
            </motion.a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-6"
          >
            What is Dite?
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Dite is a user-friendly platform designed to help students and
            educators organize coursework, collaborate, and stay on top of their
            academic journey. Built to simplify academic management, Dite is
            your all-in-one solution for productivity and collaboration.
          </motion.p>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-12"
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <FaBook
                    style={{ color: primaryGreen }}
                    className="text-4xl mb-4"
                  />
                ),
                title: "Resource Repository",
                desc: "Access academic materials like PDFs, notes, and guides.",
              },
              {
                icon: (
                  <FaComments
                    style={{ color: primaryGreen }}
                    className="text-4xl mb-4"
                  />
                ),
                title: "Discussion Forum",
                desc: "Collaborate with peers and lecturers in real-time.",
              },
              {
                icon: (
                  <FaTasks
                    style={{ color: primaryGreen }}
                    className="text-4xl mb-4"
                  />
                ),
                title: "Task Manager",
                desc: "Organize coursework and track deadlines.",
              },
              {
                icon: (
                  <FaBell
                    style={{ color: primaryGreen }}
                    className="text-4xl mb-4"
                  />
                ),
                title: "Smart Notifications",
                desc: "Stay updated on tasks and discussions.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardHover}
                whileHover="hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-12"
          >
            How It Works
          </motion.h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create an account with your email.",
              },
              {
                step: "2",
                title: "Join Your Academy",
                desc: "Enter a code or create your academy.",
              },
              {
                step: "3",
                title: "Stay Organized",
                desc: "Manage tasks, resources, and discussions.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex-1 p-6"
              >
                <div
                  style={{ backgroundColor: primaryGreen }}
                  className="text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold"
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        style={{ backgroundColor: primaryGreen }}
        className="py-16 text-white text-center"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
          >
            Ready to Simplify Your Coursework?
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-lg mb-8"
          >
            Join Dite today and take control of your academic journey!
          </motion.p>
          <motion.a
            href="\register"
            variants={buttonHover}
            whileHover="hover"
            style={{
              backgroundColor: lightGreen,
              color: primaryGreen,
            }}
            className="px-8 py-3 rounded-full font-semibold"
          >
            Get Started for Free
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Dite</h3>
            <p className="text-sm">© 2025 Dite. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              style={{ color: "white" }}
              className="hover:text-[${lightGreen}]"
            >
              Home
            </a>
            <a
              href="#features"
              style={{ color: "white" }}
              className="hover:text-[${lightGreen}]"
            >
              Features
            </a>
            <a
              href="#about"
              style={{ color: "white" }}
              className="hover:text-[${lightGreen}]"
            >
              About
            </a>
            <a
              href="#contact"
              style={{ color: "white" }}
              className="hover:text-[${lightGreen}]"
            >
              Contact
            </a>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm">Email: support@Dite.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
