/**
 * Validate Movie Image URLs
 * 
 * This script checks all TMDB image URLs from the seed data to verify they're accessible.
 * Run with: node scripts/validate-images.js
 */

import https from 'https';

// TMDB image URLs from seed data
const imageUrls = [
  // Sci-Fi Movies
  "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
  "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
  "https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg",
  "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
  "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  "https://image.tmdb.org/t/p/w500/9goPE2IoMIXxTLWzl7aizwuIiLh.jpg",
  "https://image.tmdb.org/t/p/w500/2wJI4XPlQEfDv4bLbdLMYhj7YHN.jpg",
  "https://image.tmdb.org/t/p/w500/j4F2nOYXml1LAmruNPfNLmLhvDB.jpg",
  
  // Action Movies
  "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
  "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
  "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
  "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
  "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg",
  "https://image.tmdb.org/t/p/w500/fhB0h2xIsCdMPmPL0NMkXgWxuf9.jpg",
  "https://image.tmdb.org/t/p/w500/5evjW9zfvWlCxvKUJX04fCFaJe3.jpg",
  "https://image.tmdb.org/t/p/w500/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg",
  "https://image.tmdb.org/t/p/w500/lTs1bhJl1gcJcQ8CpHzbDLp3FwG.jpg",
  
  // Drama Movies
  "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
  "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
  "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
  "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
  "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  "https://image.tmdb.org/t/p/w500/xdANQijuNrJaw1HA61rDccME4Tm.jpg",
  "https://image.tmdb.org/t/p/w500/zwzWCmH72OSC9NA0ipoqw5Zjya8.jpg",
  "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
  
  // Romance Movies
  "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
  "https://image.tmdb.org/t/p/w500/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg",
  "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
  "https://image.tmdb.org/t/p/w500/sGjIvtVvTlWnia2zfJfHz81pZ9Q.jpg",
  "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
  "https://image.tmdb.org/t/p/w500/w4cAbRH5HAbIJPx2fYmQDXPmm2Z.jpg",
  "https://image.tmdb.org/t/p/w500/nPTjj6ZfBXXBwOhd7iUy6tyuKWt.jpg",
  "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
  "https://image.tmdb.org/t/p/w500/8lI9dmz1RH20FAqltkGelBXXLr7.jpg",
  "https://image.tmdb.org/t/p/w500/f9mbM0YMLpYemcWx6o2WeiYQLDP.jpg",
  
  // Horror Movies
  "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
  "https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
  "https://image.tmdb.org/t/p/w500/lHV8HHlhwNup2VbpiACtlKzaGIQ.jpg",
  "https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg",
  "https://image.tmdb.org/t/p/w500/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg",
  "https://image.tmdb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg",
  "https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
  "https://image.tmdb.org/t/p/w500/zap5hpFCWSvdWSuPGAQyjUv2wAC.jpg",
  "https://image.tmdb.org/t/p/w500/7LEI8ulZzO5gy9Ww2NVCrKmHeDZ.jpg",
  "https://image.tmdb.org/t/p/w500/wijlZ3HaYMvlDTPqJoTCWKFkCPU.jpg",
];

function checkImageUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    https.get(url, { timeout: 5000 }, (res) => {
      const responseTime = Date.now() - startTime;
      
      if (res.statusCode === 200) {
        resolve({ 
          url, 
          status: 'OK', 
          statusCode: res.statusCode,
          responseTime: `${responseTime}ms`
        });
      } else {
        resolve({ 
          url, 
          status: 'FAIL', 
          statusCode: res.statusCode,
          responseTime: `${responseTime}ms`
        });
      }
      
      // Consume response data to free up memory
      res.resume();
    }).on('error', (err) => {
      const responseTime = Date.now() - startTime;
      resolve({ 
        url, 
        status: 'ERROR', 
        error: err.message,
        responseTime: `${responseTime}ms`
      });
    }).on('timeout', () => {
      const responseTime = Date.now() - startTime;
      resolve({ 
        url, 
        status: 'TIMEOUT',
        responseTime: `${responseTime}ms`
      });
    });
  });
}

async function validateAllImages() {
  console.log('🔍 Validating TMDB Image URLs...\n');
  console.log(`Total URLs to check: ${imageUrls.length}\n`);
  
  const results = [];
  const batchSize = 5; // Check 5 images at a time
  
  for (let i = 0; i < imageUrls.length; i += batchSize) {
    const batch = imageUrls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(url => checkImageUrl(url)));
    results.push(...batchResults);
    
    // Show progress
    console.log(`Progress: ${results.length}/${imageUrls.length}`);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(80) + '\n');
  
  const okUrls = results.filter(r => r.status === 'OK');
  const failedUrls = results.filter(r => r.status === 'FAIL');
  const errorUrls = results.filter(r => r.status === 'ERROR' || r.status === 'TIMEOUT');
  
  console.log(`✅ Working: ${okUrls.length}`);
  console.log(`❌ Failed: ${failedUrls.length}`);
  console.log(`⚠️  Errors: ${errorUrls.length}\n`);
  
  if (failedUrls.length > 0) {
    console.log('Failed URLs (Non-200 Status):');
    console.log('-'.repeat(80));
    failedUrls.forEach(result => {
      console.log(`Status ${result.statusCode}: ${result.url}`);
    });
    console.log('');
  }
  
  if (errorUrls.length > 0) {
    console.log('Error URLs (Connection Issues):');
    console.log('-'.repeat(80));
    errorUrls.forEach(result => {
      console.log(`${result.status}: ${result.url}`);
      if (result.error) console.log(`  Error: ${result.error}`);
    });
    console.log('');
  }
  
  // Calculate average response time for successful requests
  if (okUrls.length > 0) {
    const avgTime = okUrls.reduce((sum, r) => {
      const time = parseInt(r.responseTime);
      return sum + time;
    }, 0) / okUrls.length;
    
    console.log(`Average response time: ${Math.round(avgTime)}ms\n`);
  }
  
  console.log('='.repeat(80));
  
  if (failedUrls.length > 0 || errorUrls.length > 0) {
    console.log('\n⚠️  Some images are not accessible. Consider updating the seed data.');
    process.exit(1);
  } else {
    console.log('\n✅ All images are accessible!');
    process.exit(0);
  }
}

// Run validation
validateAllImages().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
