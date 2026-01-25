"use client";
import { useState } from 'react';
import Hero from '@/modules/home/Hero';
import Campaign from '@/modules/home/Campaign';

export default function Home() {
    const [value, setValue] = useState('');
    const [show, setShow] = useState(false);
  return (
    <div>
      <Hero />
      <Campaign />
    </div>
  );
}
