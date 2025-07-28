"use client";
import emailjs from '@emailjs/browser';

export default function ContactForm() {

    const sendEmail = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
        const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
        const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

        emailjs.sendForm(
            serviceID,
            templateID,
            event.currentTarget,
            userID
        )
        .then((result) => {
            console.log('Email sent successfully:', result.text);
            alert('Message sent successfully!');
        }, (error) => {
            console.error('Error sending email:', error.text);
            alert('Failed to send message. Please try again later.');
        });

        event.currentTarget.reset();
    }

    return (
        <form className="flex flex-col gap-5 p-5 font-sans bg-violet-950/60 backdrop-blur-md rounded-2xl w-full w-[90vw] max-w-md mx-auto my-auto fade" onSubmit={sendEmail}>
            <h2 className="text-2xl font-bold text-white text-center">Contact Me</h2>
            <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
            />
            <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
            />
            <textarea
                name="message"
                placeholder="Your Message"
                required
                className="p-2 rounded bg-white text-black h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
            ></textarea>
            <button
                type="submit"
                className="p-2 bg-purple-900 text-white font-sans font-semibold rounded hover:bg-purple-600 transition-colors duration-200"
            >
                Send Message
            </button>
        </form>
    );

}