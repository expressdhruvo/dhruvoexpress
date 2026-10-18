# Dhruvo Express — GitHub Pages প্রকাশনা নির্দেশিকা

চট্টগ্রামের কলসি দিঘির পাড় ও আশপাশের এলাকার জন্য responsive, static storefront। এই প্রজেক্টে স্থানীয় LPG সিলিন্ডার ও মুদি পণ্যের catalog, cart, checkout, WhatsApp support, যোগাযোগের email form, Terms ও Privacy পৃষ্ঠা আছে। মূল layout ও design স্থানীয় CSS-এ; Tailwind CDN বা প্রয়োজনীয় runtime framework ডাউনলোড হয় না।

## প্রজেক্ট ফাইল

- `index.html` — storefront, SEO metadata, contact form, checkout, payment fields ও Google Maps embed
- `styles.css`, `marketplace.css` — responsive design, local Bengali font এবং WhatsApp/email UI
- `app.js` — পণ্য/ওজন, মূল্য, অফার, delivery fee, cart ও WhatsApp order/quote logic
- `terms.html`, `privacy.html` — শর্তাবলি ও Privacy policy
- `PHOTO-CREDITS.html` — ছবির উৎস, credit, license ও অনুমতি-সংক্রান্ত নোট
- `robots.txt` — crawler access নির্দেশনা; `cms-demo/index.html`-এ `noindex`
- `assets/` — logo, payment marks, compressed local Hind Siliguri WOFF font, hero ও catalog photo; দ্রুত লোডের WebP সংস্করণও আছে
- `cms-demo/` — আলাদা শেখার/প্রোটোটাইপ পেজ; public storefront-এ সংযুক্ত নয় এবং backend/GitHub publish করে না

## এই সংস্করণে নতুন

- WhatsApp floating widget-এ Dhruvo Express-এর আসল লোগো; ছোট গোলাকার সবুজ button এবং CSS-এ কেন্দ্রীভূত SVG close icon
- যোগাযোগ অংশে ওয়েবসাইট লোগো এবং ইমেইলে সরাসরি clickযোগ্য `syedsazzadhossain8@gmail.com`
- Email form AJAX-এ submit হয়—নতুন tab খোলে না, success/error inline দেখায়; ব্যর্থ হলে direct email/WhatsApp fallback
- WhatsApp panel-এও আসল লোগো; আগের text “×”-এর বদলে কেন্দ্রে SVG icon (36×36 বাটন, 15px icon)
- সব পণ্যের দাম স্বাভাবিকভাবে দেখানো হয়—কার্ড, কার্ট, checkout ও WhatsApp অর্ডার মেসেজে; মালিক নিজে CMS/এডিটর থেকে যেকোনো সময় দাম বদলাতে পারবেন
- Terms ও Privacy পেজ, footer links এবং Google/সোশ্যাল crawler metadata

## প্রকাশের আগে অবশ্যই যাচাই করুন

catalog-এর দাম মালিকের দেওয়া/নিজে এডিট করা মান; সাইট `app.js`-এর `products` array বা CMS-এ সংরক্ষিত দামই দেখায় (`app.js`-এ `PRICING.verified: true`)। দাম সাময়িক লুকাতে চাইলে `PRICING.verified: false` করুন—তখন সাইটে “WhatsApp-এ যাচাই করুন” দেখাবে ও কোনো সংখ্যা দেখাবে না। Checkout/MFS-এ দেখানো payment number-ও merchant account হিসেবে নিশ্চিত করে নিন; নিশ্চিত না হওয়া পর্যন্ত MFS-এ টাকা নেওয়া শুরু করবেন না।

আরও যা নিশ্চিত করতে হবে:

1. Omera LPG ১২ কেজি, Bashundhara LPG ১২ কেজি, Jamuna LPG ১২ কেজি, LPG ৫.৫ কেজি, LPG ২২ কেজি, মিনিকেট চাল, মসুর ডাল, সয়াবিন তেল, চিনি, আটা, আলু ও আয়োডিনযুক্ত লবণের বর্তমান দাম/স্টক।
2. bKash ও Nagad-এর আসল merchant/গ্রহণকারী account number (যদি manual MFS চালু রাখবেন)।
3. কোন পণ্য return-eligible, চালের exchange-only নিয়ম, delivery charge, map pin/coverage list এবং final public URL.
4. Omera, Bashundhara ও retailer-sourced Jamuna ছবির reuse permission; নিশ্চিত না হলে নিজের অনুমতিপ্রাপ্ত ছবি দিন।
5. FormSubmit-এর প্রথম activation email নিশ্চিত করা এবং বাস্তব test submission করা।

## Decap CMS (/admin) দিয়ে কনটেন্ট এডিট

সাইটে একটি আসল Decap CMS (`/admin/`) যুক্ত আছে—দাম, পণ্য, ক্যাটাগরি/সাব-ক্যাটাগরি, ফ্ল্যাশ সেল, ছবির ট্যাগ, টিকার আপডেট, FAQ ও সেকশনের লেখা সব CMS থেকে এডিট করা যায়; কোড ছুঁতে হয় না। CMS সেভ করলে `content/*.json` ফাইল GitHub রিপোজিটরিতে commit হয় এবং Pages সেটি প্রকাশ করে।

- কনফিগারেশন: `admin/config.yml`, UI: `admin/index.html`
- ডেটা: `content/products.json`, `content/categories.json`, `content/flash-sale.json`, `content/settings.json`, `content/sections.json`
- কোনো ফাইল লোড না হলেও সাইট চলে—`app.js`-এর ভেতরের ডিফল্ট মান ব্যবহার করে (ফলে `content/` কোনো কারণে অনুপস্থিত থাকলেও সাইট ভাঙবে না)।
- বিস্তারিত সেটআপ ও ব্যবহার: **`README-ADMIN-BN.md`**

## পণ্য, মূল্য ও ফ্ল্যাশ সেল সম্পাদনা

`app.js`-এর `products` array-তে প্রতিটি পণ্যের `id`, নাম, package size, `price`, `deliveryWeightKg`, image path, alt text ও photo label আছে। লাইভের আগে সব মূল্য/স্টক এবং gross delivery weight ঠিক আছে কিনা দেখে নিন; দাম বদলাতে শুধু `price` মান আপডেট করলেই সব জায়গায় (কার্ড/কার্ট/checkout/WhatsApp) স্বয়ংক্রিয়ভাবে বদলাবে। ডিফল্ট অবস্থা `const PRICING = { verified: true };`—দাম দেখানো হয়। সব দাম ঠিক না হলে এটিকে `verified: false` করুন, তখন সাইট WhatsApp-এ দাম নিশ্চিত করার flow দেখাবে।

একই array-র প্রতিটি `image`-এর জন্য `imageWebp` আছে; WebP সমর্থিত browser ছোট ফাইলটি নেয়, অন্য browser original PNG/JPEG fallback ব্যবহার করে। ছবি বদলালে দুটো path, `imageAlt`, `imageLabel` এবং `PHOTO-CREDITS.html` মিলিয়ে আপডেট করুন।

যোগাযোগের আইকন: ইমেইল কার্ডে `assets/gmail-logo.svg` (Gmail-এর লোগো), WhatsApp কার্ড ও WhatsApp প্যানেলের হেডিং-এ `assets/whatsapp-logo.svg` (WhatsApp-এর লোগো)। ইমেইল ফর্মের হেডিং-এ Dhruvo Express-এর নিজস্ব লোগো (`assets/dhruvo-express-mark.webp`, fallback `.png`)। সাইটের লোগো header/footer/favicon-এও আছে।

হিরো ভিজ্যুয়াল `assets/hero/delivery-urban-branded.webp` (fallback `.jpg`)—Dhruvo Express-এর জন্য তৈরি AI-generated কর্পোরেট illustration; সিলিন্ডার ও গ্রোসারি ব্যাগে সাইটের লোগো, ব্যাকগ্রাউন্ডে শহুরে রাস্তা। কোনো স্টক-ফটো লাইসেন্স জড়িত নেই, মূল কপি `assets/hero/generated/`-এ। বদলাতে চাইলে নতুন ফাইল ওই পথে রেখে `index.html`-এর preload ও `<picture>`-এর `srcset`/`src` আপডেট করুন।

Hero-এর দৈনিক Flash Sale এখন **বন্ধ** (`FLASH_SALE.enabled: false`)—যাচাই করা offer ছাড়া discount দেখানো হবে না। আসল নিয়ম লিখে তারপর চালু করুন:

```js
const FLASH_SALE = {
  enabled: true,
  productId: 'rice-miniket', // products array-র id
  salePrice: 0,              // যাচাই করা বিক্রয়মূল্য
  endTime: '23:59:59'        // Asia/Dhaka সময়
};
```

`productId`, `salePrice` ও `endTime` মিলিয়ে দিন; sale price অবশ্যই সাধারণ দামের চেয়ে কম হতে হবে। পরের দিনের offer চাইলে `app.js` edit করে GitHub-এ commit/push করতে হবে—static GitHub Pages-এ live admin backend নেই। Scrolling ticker-এর বার্তাগুলোও একই ফাইলে `dailyOffers` array-তে সম্পাদনা করুন।

## ডেলিভারি হিসাব ও WhatsApp flow

`app.js`-এর `DELIVERY_POLICY`-তে বর্তমান নিশ্চিত bands:

- ১০ কেজি পর্যন্ত: ৳৩০
- ১০ কেজির বেশি থেকে ৩০ কেজি পর্যন্ত: ৳৬০
- ৩০ কেজির বেশি কিন্তু ৮০ কেজির কম: ৳১০০
- ৮০ কেজি বা বেশি: online checkout বন্ধ; কাস্টমার সার্ভিসে quote নিন

দূরত্বের চূড়ান্ত charge WhatsApp-এ নিশ্চিত হবে। LPG product-এর `deliveryWeightKg: null` রাখা হয়েছে, কারণ ভরা সিলিন্ডারের gross weight যাচাই হয়নি; এ অবস্থায় cart WhatsApp quote চাইবে। মুদি পণ্যের package weight-ও live করার আগে বাস্তব gross packed weight দিয়ে মিলিয়ে নিন।

WhatsApp order checkout একটি pre-filled draft খোলে। Browser নিজে থেকে message পাঠাতে পারে না—গ্রাহককে WhatsApp-এ **Send** চাপতে হবে। bKash/Nagad checkout manual; payment gateway বা automatic TrxID verification নেই। টাকা পাওয়ার তথ্য merchant account-এ নিজে যাচাই করুন।

## Email form সক্রিয় করা

যোগাযোগের form `index.html`-এ FormSubmit (`https://formsubmit.co/`) ব্যবহার করে `syedsazzadhossain8@gmail.com`-এ বার্তা পাঠায়। Formটি JavaScript-এ AJAX (`https://formsubmit.co/ajax/...`) দিয়ে submit হয়, তাই গ্রাহক একই পেজে থেকে নিশ্চিতকরণ দেখেন—আলাদা tab বা FormSubmit-এর পেজ খোলে না। JavaScript বন্ধ থাকলেও সাধারণ form POST একই tab-এ কাজ করবে। এটি free third-party service; প্রথম form submission-এর পর recipient inbox-এ FormSubmit activation email আসবে—সেই activation link নিশ্চিত না করলে email delivery চালু হবে না। Activation-এর পর test email পাঠিয়ে Inbox/Spam folder দেখুন।

**Activation না থাকলে গ্রাহক কী দেখবেন:** FormSubmit `"This form needs Activation"` রিটার্ন দিলে ফর্ম সেই ইংরেজি কথা দেখায় না; বাংলায় “ইমেইল সেবায় একবার অ্যাকটিভেশন বাকি আছে” দেখিয়ে নিচে <strong>“ইমেইল অ্যাপে খুলুন”</strong> (বার্তা আগেই লেখা থাকা mailto লিংক) ও **“WhatsApp করুন”** ফলব্যাক দেয়—ফলে কোনো বার্তা হারায় না। কোনো কারণেই নতুন tab খোলে না।

**Activation-এ ঝামেলা হলে:** `app.js`-এর উপরে `const CONTACT_FORM = { mode: 'formsubmit' };`-কে `mode: 'mailto'` করে দিন। তখন ফর্ম সাবমিট করলে কাস্টমারের নিজের মেইল অ্যাপ খুলবে, বার্তা আগেই লেখা থাকবে—কোনো third-party, activation বা সার্ভার লাগবে না (তবে কাস্টমারকে Send চাপতে হবে)।

AJAX-এর জন্য `_captcha=false` রাখা হয়েছে, কারণ reCAPTCHA-সহ AJAX submission সম্পন্ন করা যায় না; বট আটকাতে `_honey` honeypot ফিল্ড আছে। FormSubmit AJAX-এ `_autoresponse` কাজ করে না, তাই স্বয়ংক্রিয় প্রাপ্তি-স্বীকারের প্রতিশ্রুতি সাইটে দেওয়া হয়নি। চাইলে গ্রাহক email দিলে `_replyto`-তে সেটি বসে, ফলে সরাসরি Reply দিলে গ্রাহকের ইমেইলে উত্তর যাবে। ব্যক্তিগত/অর্থ-সংক্রান্ত গোপন তথ্য, PIN বা OTP form-এ চাইবেন না। Privacy details `privacy.html`-এ আছে।

## SEO ও গতি

- `index.html`-এ Bengali page title/description, Open Graph/Twitter metadata ও Organization JSON-LD রয়েছে। Final GitHub Pages URL বা custom domain ঠিক হলে `<link rel="canonical">`, `og:url`, `og:image`, sitemap-এর absolute URL এবং `robots.txt`-এর `Sitemap:` line বসান। Domain না জেনে এগুলো অনুমান করে লেখা হয়নি।
- Hero photo-র WebP preload ও `fetchpriority="high"`; product photos WebP/JPEG fallback-সহ lazy-load হয়। Product imageগুলোতে descriptive alt text আছে।
- Local CSS ও local font ব্যবহার করা হয়েছে; unused Tailwind CDN সরানো হয়েছে। Google Maps iframe lazy-load হয়; Maps নিজে external service হওয়ায় internet চাইবে।
- `robots.txt` crawler-কে storefront access দেয়। `cms-demo/index.html`-এ `noindex` আছে, তবে public repo upload-এর সময় `cms-demo/` folder বাদ রাখুন—ওটি শেখার prototype এবং বাস্তব admin/backend নয়।

## Google Maps location

বর্তমান mapটি কলসি দিঘির পাড়, চট্টগ্রামের আনুমানিক area search; নির্দিষ্ট দোকান বা delivery pin নয়। নির্ভুল জায়গা দিতে Google Maps-এ location খুলে **Share → Copy link** নিন, তারপর `index.html`-এর iframe `src` ও “Google Maps-এ খুলুন” link বদলান। Delivery area বড় হলে coverage এলাকায় কোন কোন পাড়া/রোড অন্তর্ভুক্ত তা লিখে দিন।

## GitHub Pages-এ প্রকাশ

1. GitHub-এ Public repository তৈরি করুন (উদাহরণ: `dhruvo-express`)।
2. Website-এর root-এ `index.html`, `styles.css`, `marketplace.css`, `app.js`, `terms.html`, `privacy.html`, `PHOTO-CREDITS.html`, `robots.txt`, এবং সম্পূর্ণ `assets/` folder রাখুন। `README-BN.md` রাখতে পারেন; **`cms-demo/` public root-এ দেবেন না।**
3. Repository → **Settings → Pages** → Source **Deploy from a branch**, Branch `main`, folder `/(root)` → **Save**।
4. Deploy হলে URL সাধারণত `https://YOUR-USERNAME.github.io/dhruvo-express/` হবে। নিজের live URL পেলে SEO canonical/OG/sitemap configuration-ও সেই URL দিয়ে সম্পূর্ণ করুন।
5. Site চালু হলে contact form, WhatsApp order, legal links, mobile layout এবং test order বাস্তবে পরীক্ষা করুন। GitHub Pages-এ পরিবর্তন commit/push করলে নতুন version deploy হবে।

## প্রকাশের আগে শেষ checklist

- [ ] ১২টি পণ্যের দাম/স্টক ঠিক আছে (`PRICING.verified` দরকারমতো `true`/`false`); MFS-এর আসল bKash/Nagad number
- [ ] যাচাই করা sale থাকলে product, normal price, sale price এবং Bangladesh-time end time; না থাকলে Flash Sale বন্ধ
- [ ] ছবি ব্যবহারের অনুমতি ও photo-credit; map pin এবং delivery coverage
- [ ] FormSubmit recipient activation complete এবং form থেকে বাস্তব email delivery test
- [ ] Terms-এ বাস্তব return-eligible list, rice exchange-only নিয়ম ও প্রযোজ্য delivery fee মিলেছে
- [ ] Privacy, Terms, footer email, phone ও WhatsApp links ঠিকভাবে খোলে
- [ ] ১০/৩০/৮০ কেজির boundary, LPG quote fallback, ≥৮০ কেজি checkout block, COD/MFS validation
- [ ] মোবাইল/ডেস্কটপে product image, form, widget ও WhatsApp X/round button দেখা যায়
- [ ] Final URL-এর canonical, share image, sitemap এবং Search Console/Google Business details যোগ করা হয়েছে

## Static site-এর সীমাবদ্ধতা

GitHub Pages-এ নিজস্ব backend/database নেই। Site checkout details server-এ জমা করে না; কার্টের product ID/quantity ওই browser-এর `localStorage`-এ থাকে। অর্ডারের তথ্য WhatsApp draft-এ যায়, তবে customer-কে Send চাপতে হয়। Email contact form আলাদা third-party FormSubmit service-এ POST হয়; MFS payment manual এবং স্বয়ংক্রিয় যাচাইহীন।