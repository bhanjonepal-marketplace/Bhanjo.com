import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function setupStorage() {
  console.log('📦 Checking / creating "product-images" public storage bucket...');
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  
  if (listErr) {
    console.error('Error listing buckets:', listErr.message);
    return;
  }

  const existing = buckets.find(b => b.name === 'product-images');
  if (existing) {
    console.log('✅ "product-images" bucket already exists and is ready!');
  } else {
    const { data, error } = await supabase.storage.createBucket('product-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB limit
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    });

    if (error) {
      console.error('❌ Failed to create bucket:', error.message);
    } else {
      console.log('✅ Created public "product-images" bucket successfully!');
    }
  }
}

setupStorage().catch(console.error);
