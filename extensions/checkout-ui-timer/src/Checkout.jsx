// import '@shopify/ui-extensions/preact';
// import { render } from 'preact';
// import { useEffect, useState } from 'preact/hooks';

// const TIMER_DURATION = 60 * 1000;
// const TIMER_KEY = 'checkout_timer_start';

// export default function extension() {
//   render(<Extension />, document.body);
// }

// function Extension() {
//   const { storage } = shopify;

//   const [timeLeft, setTimeLeft] = useState(60);
//   const [expired, setExpired] = useState(false);

//   // ✅ TIMER INIT (NO "hlo" STORAGE ANYMORE)
//   useEffect(() => {
//     let intervalId;

//     async function initTimer() {
//       let startTime = Number(await storage.read(TIMER_KEY));


//       // ✅ First time timer start
//       if (!startTime) {
//         startTime = Date.now();
//         await storage.write(TIMER_KEY, startTime);
//       }

//       intervalId = setInterval(async () => {
//         const now = Date.now();
//         const elapsed = now - startTime;
//         const remaining = TIMER_DURATION - elapsed;

//         if (remaining <= 0) {
//           clearInterval(intervalId);
//           setExpired(true);
//           setTimeLeft(0);

//           // ✅ only timer cleared
//           await storage.delete(TIMER_KEY);
//           return;
//         }

//         setTimeLeft(Math.ceil(remaining / 1000));
//       }, 1000);
//     }

//     initTimer();
//     return () => intervalId && clearInterval(intervalId);
//   }, [storage]);

//   return (
//     <>
//     <s-text>{shopify.settings.value.timer_seconds || "///"}</s-text>
//       {!expired ? (
//         <s-banner heading="Order Reservation Timer" tone="success">
//           <s-text>
//             Time Remaining:{' '}
//             <s-text type="emphasis">{timeLeft} seconds</s-text>
//           </s-text>
//         </s-banner>
//       ) : (
//         <s-banner heading="Reservation Ended" tone="critical">
//           <s-text>YOUR ORDER RESERVATION ENDED</s-text>
//         </s-banner>
//       )}
//     </>
//   );
// }


import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const TIMER_KEY = 'checkout_timer_start';

export default function extension() {
  render(<Extension />, document.body);
}

// ✅ "01:30" → 90 seconds conversion
function parseTimeToSeconds(timeString) {
  if (!timeString) return 60;

  // ✅ Case 1: "01:30" format
  if (typeof timeString === 'string' && timeString.includes(':')) {
    const [minutes, seconds] = timeString.split(':').map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      return minutes * 60 + seconds;
    }
  }

  // ✅ Case 2: "1", "2", "3" → minutes
  const numericValue = Number(timeString);
  if (!isNaN(numericValue)) {
    return numericValue * 60;
  }

  // ✅ Fallback
  return 60;
}



function Extension() {
  const { storage } = shopify;

  // ✅ Get time from Shopify setting like "01:00"
  const rawTime = shopify.settings.value.timer_seconds || "10";
  const totalSeconds = parseTimeToSeconds(rawTime);
  const TIMER_DURATION = totalSeconds * 1000;

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let intervalId;

    async function initTimer() {
      let startTime = Number(await storage.read(TIMER_KEY));

      if (!startTime) {
        startTime = Date.now();
        await storage.write(TIMER_KEY, startTime);
      }

      intervalId = setInterval(async () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const remaining = TIMER_DURATION - elapsed;

        if (remaining <= 0) {
          clearInterval(intervalId);
          setExpired(true);
          setTimeLeft(0);
          await storage.delete(TIMER_KEY);
          return;
        }

        setTimeLeft(Math.ceil(remaining / 1000));
      }, 1000);
    }

    initTimer();
    return () => intervalId && clearInterval(intervalId);
  }, [storage, TIMER_DURATION]);

  // ✅ Display MM:SS format
let minutes = Math.floor(timeLeft / 60);
let seconds = timeLeft % 60;

// ✅ Smart display: left side 0 hide
let displayTime = '';

if (minutes > 0) {
  displayTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
} else {
  displayTime = `${seconds}`; // ✅ 00:30 → 30
}


  return (
    <>
      {!expired ? (
        <s-banner heading={`Order reserved for the next ${displayTime}`} tone="success">
        </s-banner>
      ) : (
        <s-banner heading="YOUR ORDER RESERVATION ENDED" tone="critical">
        </s-banner>
      )}
    </>
  );
}
