'use client';

import { useState } from 'react';
import { Button } from '@/components/element/Button';
import { Checkbox } from '@/components/element/Checkbox';
import { Radio } from '@/components/element/Radio';
import InputField from '@/components/element/InputField';
import { CircularProgress } from '@/components/element/CircularProgress';
import { CampaignCard } from '@/components/element/CampaignCard';
import {
  DropdownRoot,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from '@/components/element/Dropdown';
import { IoSearch, IoMail, IoAdd, IoArrowForward, IoHeart, IoShareSocial } from 'react-icons/io5';

export default function ComponentShowcase() {
  const [checkboxState, setCheckboxState] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [progress, setProgress] = useState(50);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-sf-semibold text-zinc-900 dark:text-white mb-12">
          Component Showcase
        </h1>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-sf-semibold text-zinc-900 dark:text-white mb-6">
            Buttons
          </h2>
          
          <div className="space-y-8">
            {/* Primary Variant */}
            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Primary
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
                <Button variant="primary" size="md" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            {/* Secondary Variant */}
            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Secondary
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="sm">
                  Small
                </Button>
                <Button variant="secondary" size="md">
                  Medium
                </Button>
                <Button variant="secondary" size="lg">
                  Large
                </Button>
                <Button variant="secondary" size="md" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            {/* Black Variant */}
            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Black
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="black" size="sm">
                  Small
                </Button>
                <Button variant="black" size="md">
                  Medium
                </Button>
                <Button variant="black" size="lg">
                  Large
                </Button>
                <Button variant="black" size="md" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Black
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="rounded" size="rounded" leftIcon={<IoAdd />}>
                  Small
                </Button>
                <Button variant="rounded" size="rounded" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            {/* Wallet Size */}
            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Wallet Size
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="wallet">
                  Connect Wallet
                </Button>
              </div>
            </div>

            {/* Buttons with Icons */}
            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                With Icons
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="md" leftIcon={<IoAdd />}>
                  Add New
                </Button>
                <Button variant="primary" size="md" rightIcon={<IoArrowForward />}>
                  Continue
                </Button>
                <Button variant="secondary" size="md" leftIcon={<IoHeart />}>
                  Favorite
                </Button>
                <Button variant="secondary" size="md" rightIcon={<IoShareSocial />}>
                  Share
                </Button>
                <Button variant="black" size="md" leftIcon={<IoSearch />}>
                  Search
                </Button>
                <Button variant="black" size="md" leftIcon={<IoAdd />} rightIcon={<IoArrowForward />}>
                  Both Icons
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Checkbox Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-sf-semibold text-zinc-900 dark:text-white mb-6">
            Checkbox
          </h2>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex flex-col gap-2">
              <Checkbox 
                checked={checkboxState} 
                onChange={() => setCheckboxState(!checkboxState)}
              />
              <span className="text-sm text-zinc-600">Normal</span>
            </div>
            <div className="flex flex-col gap-2">
              <Checkbox checked={true} onChange={() => {}} />
              <span className="text-sm text-zinc-600">Checked</span>
            </div>
            <div className="flex flex-col gap-2">
              <Checkbox checked={false} disabled />
              <span className="text-sm text-zinc-600">Disabled</span>
            </div>
            <div className="flex flex-col gap-2">
              <Checkbox checked={true} disabled />
              <span className="text-sm text-zinc-600">Checked Disabled</span>
            </div>
          </div>
        </section>

        {/* Radio Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-sf-semibold text-zinc-900 dark:text-white mb-6">
            Radio
          </h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3">
                <Radio
                  name="radio-group"
                  value="option1"
                  checked={radioValue === 'option1'}
                  onChange={() => setRadioValue('option1')}
                />
                <span className="text-sm text-zinc-700">Option 1</span>
              </label>
              <label className="flex items-center gap-3">
                <Radio
                  name="radio-group"
                  value="option2"
                  checked={radioValue === 'option2'}
                  onChange={() => setRadioValue('option2')}
                />
                <span className="text-sm text-zinc-700">Option 2</span>
              </label>
              <label className="flex items-center gap-3">
                <Radio
                  name="radio-group"
                  value="option3"
                  checked={radioValue === 'option3'}
                  onChange={() => setRadioValue('option3')}
                />
                <span className="text-sm text-zinc-700">Option 3</span>
              </label>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 opacity-50">
                <Radio
                  name="radio-disabled"
                  value="disabled1"
                  disabled
                />
                <span className="text-sm text-zinc-500">Disabled</span>
              </label>
              <label className="flex items-center gap-3 opacity-50">
                <Radio
                  name="radio-disabled-checked"
                  value="disabled2"
                  checked
                  disabled
                />
                <span className="text-sm text-zinc-500">Disabled Checked</span>
              </label>
            </div>
          </div>
        </section>

        {/* Input Field Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-sf-semibold text-zinc-900 dark:text-white mb-6">
            Input Field
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Input */}
            <InputField
              label="Default Input"
              placeholder="Type something..."
              helperText="This is a helper text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            {/* Search Variant */}
            <InputField
              label="Search Input"
              variant="search"
              placeholder="Search..."
              helperText="Search variant without border"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              leftIcon={<IoSearch />}
            />

            {/* With Left Icon */}
            <InputField
              label="Email Input"
              placeholder="email@example.com"
              helperText="Input with left icon"
              type="email"
              leftIcon={<IoMail />}
            />

            {/* With Right Icon */}
            <InputField
              label="Search with Icon"
              placeholder="Search..."
              helperText="Input with right icon"
              rightIcon={<IoSearch />}
            />

            {/* Error State */}
            <InputField
              label="Error State"
              placeholder="This has an error"
              helperText="Error message appears here"
              error={true}
            />

            {/* Disabled State */}
            <InputField
              label="Disabled Input"
              placeholder="Disabled"
              helperText="This input is disabled"
              disabled={true}
            />
          </div>
        </section>

        {/* Dropdown Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-sf-semibold text-zinc-900 dark:text-white mb-6">
            Dropdown
          </h2>
          <div className="flex gap-4">
            <DropdownRoot>
              <DropdownButton label="Select Option" />
              <DropdownMenu>
                <DropdownItem onClick={() => console.log('Option 1')}>
                  Option 1
                </DropdownItem>
                <DropdownItem onClick={() => console.log('Option 2')}>
                  Option 2
                </DropdownItem>
                <DropdownItem onClick={() => console.log('Option 3')}>
                  Option 3
                </DropdownItem>
                <DropdownItem onClick={() => console.log('Option 4')}>
                  Option 4
                </DropdownItem>
              </DropdownMenu>
            </DropdownRoot>

            <DropdownRoot>
              <DropdownButton label="Another Dropdown" />
              <DropdownMenu>
                <DropdownItem onClick={() => console.log('Action 1')}>
                  Action 1
                </DropdownItem>
                <DropdownItem onClick={() => console.log('Action 2')}>
                  Action 2
                </DropdownItem>
              </DropdownMenu>
            </DropdownRoot>
          </div>
        </section>

        {/* Circular Progress Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-sf-semibold text-zinc-900 dark:text-white mb-6">
            Circular Progress
          </h2>
          
          {/* Static Progress */}
          <div className="mb-8">
            <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
              Static Progress Indicators
            </h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col items-center gap-2">
                <CircularProgress value={0} />
                <span className="text-sm text-zinc-600">0%</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CircularProgress value={25} />
                <span className="text-sm text-zinc-600">25%</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CircularProgress value={50} />
                <span className="text-sm text-zinc-600">50%</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CircularProgress value={75} />
                <span className="text-sm text-zinc-600">75%</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CircularProgress value={100} />
                <span className="text-sm text-zinc-600">100%</span>
              </div>
            </div>
          </div>

          {/* Interactive Progress */}
          <div>
            <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
              Interactive Progress
            </h3>
            <div className="flex flex-col items-start gap-4">
              <CircularProgress value={progress} />
              <div className="flex flex-col gap-2 w-full max-w-md">
                <span className="text-lg font-sf-medium text-zinc-900 dark:text-white">
                  {progress}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Campaign Card Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-sf-semibold text-zinc-900 dark:text-white mb-6">
            Campaign Card
          </h2>
          
          <div className="space-y-8">
            {/* max-w-lg Container */}
            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Max Width Large (max-w-lg)
              </h3>
              <div className="max-w-lg">
                <CampaignCard
                  id="1"
                  imageUrl="/assets/images/placeholder.webp"
                  title="Banjir Sumatera"
                  description="Bantuan untuk korban banjir di Sumatera"
                  progress={progress}
                />
              </div>
            </div>

            {/* max-w-md Container */}
            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Max Width Medium (max-w-md)
              </h3>
              <div className="max-w-md">
                <CampaignCard
                  id="2"
                  imageUrl="/assets/images/placeholder.webp"
                  title="Banjir Sumatera"
                  description="Bantuan untuk korban banjir di Sumatera"
                  progress={progress}
                />
              </div>
            </div>

            {/* max-w-sm Container */}
            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Max Width Small (max-w-sm)
              </h3>
              <div className="max-w-sm">
                <CampaignCard
                  id="3"
                  imageUrl="/assets/images/placeholder.webp"
                  title="Banjir Sumatera"
                  description="Bantuan untuk korban banjir di Sumatera"
                  progress={progress}
                />
              </div>
            </div>

            {/* max-w-xs Container */}
            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Max Width Extra Small (max-w-xs)
              </h3>
              <div className="max-w-xs">
                <CampaignCard
                  id="4"
                  imageUrl="/assets/images/placeholder.webp"
                  title="Banjir Sumatera"
                  description="Bantuan untuk korban banjir di Sumatera"
                  progress={progress}
                />
              </div>
            </div>

            {/* Dynamic Progress Control */}
            <div>
              <h3 className="text-lg font-sf-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Adjust Progress
              </h3>
              <div className="flex flex-col gap-2 w-full max-w-md">
                <span className="text-lg font-sf-medium text-zinc-900 dark:text-white">
                  Progress: {progress}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
