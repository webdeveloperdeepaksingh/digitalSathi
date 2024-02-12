import React from 'react';
import ContactUs from '@/components/ContactUs/page';
import Footer from '@/components/Footer/page';

export const metadata = {
  title: "DigitalSath: Contact Us",
  description: "Contact Us"
}

export default function ContactForm() {
  return (
    <div>
      <ContactUs/>
      <Footer/>
    </div>
  )
}
