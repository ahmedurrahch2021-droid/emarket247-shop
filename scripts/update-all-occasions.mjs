import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const OCCASIONS_DATA = {
  wedding: {
    en: {
      title: "Wedding Jewellery & Ceremonial Sets | eMarket247",
      metaDesc: "Celebrate timeless unions with eMarket247 wedding jewellery. From Gaye Holud to grand receptions, discover handcrafted heirlooms, traditional sita hars, and bridal suites.",
      ogTitle: "Wedding Jewellery & Ceremonial Sets | eMarket247",
      ogDesc: "From Gaye Holud celebrations to royal wedding receptions, explore heirloom-inspired jewellery crafted to honor enduring vows.",
      ogImage: "https://emarket247.shop/assets/images/editorial/emarket247-bridal-occasion-editorial.webp",
      heroImg: "/assets/images/editorial/emarket247-bridal-occasion-editorial.webp",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> Wedding Edit',
      heroH1: "Celebrate timeless unions with handcrafted artistry.",
      heroP: "From vibrant Gaye Holud celebrations to royal wedding receptions, explore heirloom-inspired jewellery crafted to honor enduring vows and joyful ceremonies.",
      assuranceTitle: "eMarket247 Wedding Shopping Assurance",
      assurance: [
        { title: "Trousseau Consultation", desc: "Speak directly on WhatsApp to coordinate bridal sets with sari tones and ceremony themes." },
        { title: "True Studio Lighting", desc: "View unedited photographic captures showing authentic gold luster and gemstone brilliance." },
        { title: "Pan-Bangladesh Dispatch", desc: "Safe, trackable delivery planned well ahead of ceremony dates across all 64 districts." },
        { title: "Verified Specifications", desc: "Accurate bangle inner diameters, necklace drops, and piece weights for confident selection." }
      ],
      catIntro: "Explore curated jewellery forms to complement each stage of the wedding celebration.",
      categories: [
        { name: "Jewellery Sets", sub: "Harmonious ceremonial suites", href: "/en/categories/jewellery-sets/" },
        { name: "Necklaces", sub: "Statement chokers & sita hars", href: "/en/categories/necklaces/" },
        { name: "Bangles", sub: "Traditional bala & kankan pairs", href: "/en/categories/bangles/" },
        { name: "Earrings", sub: "Chandelier jhumkas & kanpashas", href: "/en/categories/earrings/" },
        { name: "Rings", sub: "Heritage filigree cocktail rings", href: "/en/categories/rings/" },
        { name: "Bridal Jewellery", sub: "Comprehensive bridal edits", href: "/en/categories/bridal-jewellery/" }
      ],
      guideEyebrow: "Ceremonial Moments & Styling",
      guideTitle: "Curated styling for each wedding celebration",
      guides: [
        { num: "01", title: "Gaye Holud & Mehendi Radiance", text: "Bright floral tones and lightweight gold-tone pieces that pair gracefully with yellow, orange, and green celebratory silks.", linkText: "Earrings Collection", href: "/en/categories/earrings/" },
        { num: "02", title: "The Grand Wedding Vows", text: "Elaborate multi-tier necklaces, heirloom sita hars, and regal maang tikkas that crown the bride with majestic grace.", linkText: "Bridal Sets", href: "/en/categories/bridal-jewellery/" },
        { num: "03", title: "Reception Evening Elegance", text: "Polished statement chokers and contemporary gemstone pairings designed to shine under ambient reception ballroom lighting.", linkText: "Necklaces Collection", href: "/en/categories/necklaces/" },
        { num: "04", title: "Family & Trousseau Keepsakes", text: "Thoughtful keepsake jewellery gifts for mothers, sisters, and close relatives, preserved in commemorative packaging.", linkText: "Gift Ideas", href: "/en/occasions/gifts/" }
      ],
      panelImg: "/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      panelCap: "eMarket247 Wedding Ceremonial Collection",
      panelEyebrow: "Wedding Planning Support",
      panelH2: "Thoughtful ceremonial planning without last-minute panic.",
      panelP1: "Wedding schedules in Bangladesh are demanding and time-sensitive. eMarket247 provides early dimensions, weight details, and direct WhatsApp consultations so families can coordinate jewellery with outfits calmly.",
      panelP2: "No exaggerated claims or synthetic rush. We promise factual specifications, dependable timelines, and complete post-purchase support for your family's most memorable milestone.",
      panelBtn: "Inquire on WhatsApp ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20inquire%20about%20the%20eMarket247%20Wedding%20Collection"
    },
    bn: {
      title: "বিয়ের জুয়েলারি ও ব্রাইডাল সেট | eMarket247",
      metaDesc: "বিয়ের অবিস্মরণীয় মুহূর্তগুলো রাঙিয়ে তুলতে eMarket247-এর ঐতিহ্যবাহী ব্রাইডাল ও বিয়ের জুয়েলারি কালেকশন। গায়ে হলুদ থেকে শুরু করে বিবাহোত্তর সংবর্ধনা—সব আয়োজনের জন্য নিখুঁত অলংকার।",
      ogTitle: "বিয়ের জুয়েলারি ও ব্রাইডাল সেট | eMarket247",
      ogDesc: "ঐতিহ্যের কারুকাজে সাজুক বিয়ের স্মরণীয় মুহূর্ত। হলুদ সন্ধ্যা থেকে জমকালো বিবাহোত্তর সংবর্ধনা পর্যন্ত নান্দনিক কালেকশন।",
      ogImage: "https://emarket247.shop/assets/images/editorial/emarket247-bridal-occasion-editorial.webp",
      heroImg: "/assets/images/editorial/emarket247-bridal-occasion-editorial.webp",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> ওয়েডিং এডিট',
      heroH1: "ঐতিহ্যের কারুকাজে সাজুক বিয়ের স্মরণীয় মুহূর্ত।",
      heroP: "হলুদ সন্ধ্যা থেকে জমকালো বিবাহোত্তর সংবর্ধনা—প্রতিটি মাঙ্গলিক মুহূর্তের জন্য ঐতিহ্যবাহী কারুকাজের অনুপম ও নির্ভরযোগ্য জুয়েলারি কালেকশন।",
      assuranceTitle: "eMarket247 ওয়েডিং শপিং নিশ্চয়তা",
      assurance: [
        { title: "ব্রাইডাল পরামর্শ সেবা", desc: "শাড়ির রঙ ও ডিজাইনের সাথে মানানসই গহনা নির্বাচনে হোয়াটসঅ্যাপে সরাসরি পরামর্শ নিন।" },
        { title: "স্বচ্ছ স্টুডিও ফটোগ্রাফি", desc: "কোনো বিভ্রান্তিকর ফিল্টার ছাড়াই বাস্তব রূপ, সোনালি আভা ও ফিনিশিং দেখতে পাবেন।" },
        { title: "দেশজুড়ে নিরাপদ ডেলিভারি", desc: "বিয়ের অনুষ্ঠান শুরুর আগেই নিরাপদে পৌঁছে দেওয়ার নির্ভরযোগ্য ডেলিভারি ব্যবস্থা।" },
        { title: "সঠিক পরিমাপ ও বিবরণ", desc: "চুড়ির সাইজ, নেকলেসের দৈর্ঘ্য ও ওজনের সঠিক তথ্য দেওয়া থাকে প্রতিটি পণ্যে।" }
      ],
      catIntro: "বিয়ের প্রতিটি পর্বের জন্য মানানসই গহনা নির্বাচন করতে পছন্দের ক্যাটাগরি ঘুরে দেখুন।",
      categories: [
        { name: "জুয়েলারি সেট", sub: "পরিপূর্ণ বিয়ের সেট", href: "/bn/categories/jewellery-sets/" },
        { name: "নেকলেস", sub: "চোকার ও জমকালো সীতা হার", href: "/bn/categories/necklaces/" },
        { name: "চুড়ি", sub: "বালা ও ঐতিহ্যবাহী কঙ্কণ", href: "/bn/categories/bangles/" },
        { name: "কানের দুল", sub: "ঝুমকা ও কানপাশা", href: "/bn/categories/earrings/" },
        { name: "আংটি", sub: "ফিলিগ্রি ও ককটেল আংটি", href: "/bn/categories/rings/" },
        { name: "ব্রাইডাল জুয়েলারি", sub: "রাজকীয় কনের সাজ", href: "/bn/categories/bridal-jewellery/" }
      ],
      guideEyebrow: "বিশেষ ক্ষণ ও অলংকার শৈলী",
      guideTitle: "বিয়ের প্রতিটি অনুষ্ঠানের জন্য মানানসই সাজ",
      guides: [
        { num: "০১", title: "গায়ে হলুদ ও মেহেন্দির উজ্জ্বলতা", text: "হলুদ ও সবুজ পোশাকের সাথে মানানসই হালকা ও নজরকাড়া সোনালি রঙের গহনা, যা অনুষ্ঠানে স্বাচ্ছন্দ্য বজায় রাখবে।", linkText: "কানের দুল কালেকশন", href: "/bn/categories/earrings/" },
        { num: "০২", title: "মূল বিয়ের রাজকীয় আভিজাত্য", text: "লাল বেনারসির সাথে ভারী সীতা হার, টিকলি ও রতনচূড়ের ঐতিহ্যবাহী সমন্বয়ে কনের রূপ পায় পরিপূর্ণতা।", linkText: "ব্রাইডাল সেট", href: "/bn/categories/bridal-jewellery/" },
        { num: "০৩", title: "রিসিপশনের আভিজাত্য", text: "সন্ধ্যা বা রাতের বিবাহোত্তর সংবর্ধনায় গাউন বা জমকালো শাড়ির সাথে মানানসই আধুনিক চোকার ও রত্নখচিত জুয়েলারি।", linkText: "নেকলেস কালেকশন", href: "/bn/categories/necklaces/" },
        { num: "০৪", title: "পারিবারিক উপহার ও তত্ত্বের সাজ", text: "মা, বোন ও নিকটাত্মীয়দের জন্য স্মারক উপহার হিসেবে অনন্য জুয়েলারি, যা স্মৃতিময় হয়ে থাকবে আজীবন।", linkText: "উপহার কালেকশন", href: "/bn/occasions/gifts/" }
      ],
      panelImg: "/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      panelCap: "eMarket247 ওয়েডিং সেরিমোনিয়াল কালেকশন",
      panelEyebrow: "বিয়ের কেনাকাটার প্রস্তুতি",
      panelH2: "শেষ মুহূর্তের অনিশ্চয়তা নয়, নিশ্চিন্তে বিয়ের পরিকল্পনা।",
      panelP1: "বিয়ের ব্যস্ততায় শেষ মুহূর্তে গহনা পছন্দ করা কঠিন ও ঝুঁকিপূর্ণ। eMarket247-এ প্রতিটি গহনার সঠিক সাইজ, ওজন ও স্বচ্ছ ছবি দেখে আগেই পরিবারের সাথে আলোচনা করে সিদ্ধান্ত নিতে পারেন।",
      panelP2: "কোনো অতিরিক্ত প্রতিশ্রুতি বা চটকদার বিজ্ঞাপনী ফাঁদ নয়—বাস্তব গুণমান ও নির্ভরযোগ্য কাস্টমার সাপোর্টের মাধ্যমে আপনার আনন্দময় আয়োজনে পাশে থাকাই আমাদের অঙ্গীকার।",
      panelBtn: "হোয়াটসঅ্যাপে যোগাযোগ করুন ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20inquire%20about%20the%20eMarket247%20Wedding%20Collection"
    }
  },
  bridal: {
    en: {
      title: "Bridal Jewellery & Trousseau Sets | eMarket247",
      metaDesc: "Discover exquisite bridal jewellery at eMarket247. Handcrafted sita hars, intricate jhumkas, and complete bridal sets designed for your unforgettable day.",
      ogTitle: "Bridal Jewellery & Trousseau Sets | eMarket247",
      ogDesc: "Handcrafted bridal ornaments created with traditional filigree mastery and celestial grace for your most unforgettable day.",
      ogImage: "https://emarket247.shop/assets/images/editorial/Bridal.png",
      heroImg: "/assets/images/editorial/Bridal.png",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> Bridal Edit',
      heroH1: "Regal bridal artistry for your once-in-a-lifetime walk.",
      heroP: "Handcrafted bridal ornaments created with traditional filigree mastery, layered sita hars, and celestial grace for your most unforgettable matrimonial day.",
      assuranceTitle: "eMarket247 Bridal Shopping Assurance",
      assurance: [
        { title: "Bridal Stylist Support", desc: "Direct guidance on pairing necklace lengths and earring weights with your bridal neckline." },
        { title: "Detailed Dimensional Honesty", desc: "Every bridal set documents precise choker height, pendant drop, and bangle circumference." },
        { title: "Comfort-Weighted Pieces", desc: "Engineered for long ceremony endurance without painful neck strain or ear lobe tugging." },
        { title: "Discreet White-Glove Dispatch", desc: "Rigid luxury keepsake packaging that safeguards every filigree joint during courier transit." }
      ],
      catIntro: "Explore complete bridal categories crafted to crown the bride with timeless elegance.",
      categories: [
        { name: "Bridal Jewellery", sub: "Complete royal bridal suites", href: "/en/categories/bridal-jewellery/" },
        { name: "Necklaces", sub: "Multi-tier chokers & sita hars", href: "/en/categories/necklaces/" },
        { name: "Earrings", sub: "Heirloom jhumkas & kanpasha", href: "/en/categories/earrings/" },
        { name: "Bangles", sub: "Ornate bala, chur & kankan", href: "/en/categories/bangles/" },
        { name: "Jewellery Sets", sub: "Coordinated ceremonial suites", href: "/en/categories/jewellery-sets/" },
        { name: "Rings", sub: "Lattice dome statement rings", href: "/en/categories/rings/" }
      ],
      guideEyebrow: "Bridal Architecture & Styling",
      guideTitle: "Curated styling principles for the radiant bride",
      guides: [
        { num: "01", title: "The Royal Choker & Sita Har Duo", text: "Harmonizing a snug, intricately textured collar with an elongated waist-length sita har to elongate posture and frame heavy zardosi work.", linkText: "Necklaces Collection", href: "/en/categories/necklaces/" },
        { num: "02", title: "Ergonomic Bridal Jhumkas", text: "Selecting multi-tiered bell jhumkas with balanced weight distribution and supportive ear chains for effortless comfort through hours of rituals.", linkText: "Earrings Collection", href: "/en/categories/earrings/" },
        { num: "03", title: "Traditional Wrist Symphony", text: "Stacking classic gold-tone bala, intricately engraved chur, and paired kankan to honor authentic Bengali bridal aesthetic heritage.", linkText: "Bangles Collection", href: "/en/categories/bangles/" },
        { num: "04", title: "Heirloom Bridal Keepsake Care", text: "How to preserve delicate filigree work, avoid perfume discoloration, and store heirloom pieces securely in moisture-resistant velvet cases.", linkText: "Jewellery Care Guide", href: "/en/care/" }
      ],
      panelImg: "/assets/images/editorial/emarket247-bridal-occasion-editorial.webp",
      panelCap: "eMarket247 Bridal Atelier Masterpiece",
      panelEyebrow: "The Bride's Sanctuary",
      panelH2: "Every bride deserves honest details and patient guidance.",
      panelP1: "Selecting your bridal jewellery should be a joyful, reassuring journey—not an overwhelming rush under intense showroom lighting. We photograph all bridal ornaments under balanced daylight to ensure the gold tone matches your saree border perfectly.",
      panelP2: "Our dedicated bridal concierge is available on WhatsApp to review outfit photos, confirm exact dimensions, and ensure your order arrives safely with ample time for pre-ceremony trials.",
      panelBtn: "Bridal Consultation on WhatsApp ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20consult%20on%20the%20eMarket247%20Bridal%20Collection"
    },
    bn: {
      title: "ব্রাইডাল জুয়েলারি ও কনের গহনা | eMarket247",
      metaDesc: "জীবনের সবচেয়ে স্মরণীয় দিনের জন্য eMarket247-এর রাজকীয় ব্রাইডাল জুয়েলারি। নিখুঁত সীতা হার, ঝুমকা ও পূর্ণাঙ্গ ব্রাইডাল সেট যা বেনারসির সাথে এনে দেয় অনুপম আভিজাত্য।",
      ogTitle: "ব্রাইডাল জুয়েলারি ও কনের গহনা | eMarket247",
      ogDesc: "জীবনের সবচেয়ে স্মরণীয় দিনের জন্য রাজকীয় ব্রাইডাল সাজ। ঐতিহ্যবাহী ফিলিগ্রি ও অনুপম কারুকাজে নির্মিত গহনা।",
      ogImage: "https://emarket247.shop/assets/images/editorial/Bridal.png",
      heroImg: "/assets/images/editorial/Bridal.png",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> ব্রাইডাল এডিট',
      heroH1: "জীবনের সবচেয়ে স্মরণীয় দিনের জন্য রাজকীয় ব্রাইডাল সাজ।",
      heroP: "বেনারসি শাড়ির সাথে মানানসই সীতা হার, জমকালো ঝুমকা ও রতনচূড়—কনের অপরূপ সৌন্দর্যকে পূর্ণতা দিতে নিখুঁত ফিলিগ্রি ও রাজকীয় ব্রাইডাল জুয়েলারি কালেকশন।",
      assuranceTitle: "eMarket247 ব্রাইডাল শপিং নিশ্চয়তা",
      assurance: [
        { title: "ব্যক্তিগত ব্রাইডাল সহায়তা", desc: "শাড়ির জমিন ও গলার কাটের সাথে মানানসই গহনা নির্বাচনে সরাসরি পরামর্শের সুযোগ।" },
        { title: "নিখুঁত সাইজ ও পরিমাপ", desc: "চোকারের বিস্তার, কানের দুলের ঝুল ও চুড়ির সঠিক পরিমাপ বিস্তারিতভাবে দেওয়া থাকে।" },
        { title: "আরামদায়ক ওজন বিন্যাস", desc: "দীর্ঘ সময় ধরে পরিধানের উপযোগী করে তৈরি, যাতে অনুষ্ঠানে কোনো অস্বস্তি না হয়।" },
        { title: "সুরক্ষিত বিলাসবহুল প্যাকেজিং", desc: "প্রতিটি সূক্ষ্ম কারুকাজ অক্ষত রাখতে বিশেষ আর্দ্রতারোধক প্রিমিয়াম বক্সে ডেলিভারি।" }
      ],
      catIntro: "কনের রাজকীয় সাজকে নিখুঁত করতে প্রতিটি ব্রাইডাল ক্যাটাগরি ঘুরে দেখুন।",
      categories: [
        { name: "ব্রাইডাল জুয়েলারি", sub: "পূর্ণাঙ্গ রাজকীয় ব্রাইডাল সেট", href: "/bn/categories/bridal-jewellery/" },
        { name: "নেকলেস", sub: "চোকার ও ঐতিহ্যবাহী সীতা হার", href: "/bn/categories/necklaces/" },
        { name: "কানের দুল", sub: "ভারী ঝুমকা ও কানপাশা", href: "/bn/categories/earrings/" },
        { name: "চুড়ি", sub: "বালা, চুর ও নকশাদার কঙ্কণ", href: "/bn/categories/bangles/" },
        { name: "জুয়েলারি সেট", sub: "সমন্বিত মাঙ্গলিক অলংকার", href: "/bn/categories/jewellery-sets/" },
        { name: "আংটি", sub: "ফিলিগ্রি রাজকীয় আংটি", href: "/bn/categories/rings/" }
      ],
      guideEyebrow: "ব্রাইডাল সাজের পরামর্শ",
      guideTitle: "কনের রূপের সাথে অলংকারের নিখুঁত মেলবন্ধন",
      guides: [
        { num: "০১", title: "চোকার ও সীতা হারের ভারসাম্য", text: "গলার কাছে মানানসই চোকার এবং নাভি পর্যন্ত লম্বা সীতা হারের মেলবন্ধন ভারী জরির কাজের শাড়িতে রাজকীয় আভিজাত্য এনে দেয়।", linkText: "নেকলেস কালেকশন", href: "/bn/categories/necklaces/" },
        { num: "০২", title: "আরামদায়ক ব্রাইডাল ঝুমকা", text: "কানের লতির ওপর অতিরিক্ত চাপ না ফেলে বহুস্তরবিশিষ্ট জমকালো ঝুমকা ও কানটানা দীর্ঘক্ষণ স্বাচ্ছন্দ্যের সাথে পরার নিয়ম।", linkText: "কানের দুল কালেকশন", href: "/bn/categories/earrings/" },
        { num: "০৩", title: "হাতের ঐতিহ্যবাহী সাজ: বালা ও কঙ্কণ", text: "বাঙালিয়ানার চিরন্তন আবেদন বজায় রাখতে শাঁখা-পলার সাথে স্বর্ণালি বালা ও চুরের সুষম বিন্যাস।", linkText: "চুড়ি কালেকশন", href: "/bn/categories/bangles/" },
        { num: "০৪", title: "বিয়ের গহনার যত্ন ও সংরক্ষণ", text: "অনুষ্ঠান শেষে সূক্ষ্ম কারুকাজের গহনা পরিষ্কার রাখা ও দীর্ঘস্থায়ী চকচকে ভাব ধরে রাখতে সঠিক বক্স ও সংরক্ষণের উপায়।", linkText: "যত্ন সহায়িকা", href: "/bn/care/" }
      ],
      panelImg: "/assets/images/editorial/emarket247-bridal-occasion-editorial.webp",
      panelCap: "eMarket247 ব্রাইডাল অ্যাটেলিয়ার মাস্টারপিস",
      panelEyebrow: "কনের জন্য বিশেষ আয়োজন",
      panelH2: "কনের বিশেষ দিনের জন্য সঠিক তথ্য ও আন্তরিক পরামর্শ।",
      panelP1: "বিয়ের মতো জীবনের অনন্য দিনে গহনা পছন্দ করা উচিত কোনো সংশয় ছাড়াই। কৃত্রিম আলোর বিভ্রান্তি এড়াতে আমরা প্রতিটি গহনার ছবি তুলেছি দিনের স্বাভাবিক আলোয়, যাতে শাড়ির সাথে রঙের অমিল না ঘটে।",
      panelP2: "হোয়াটসঅ্যাপে আমাদের সাথে কথা বলে আপনি সাইজ, ওজন ও ডেলিভারি সম্পর্কে নিশ্চিত হতে পারেন। বিয়ের তারিখের যথেষ্ট আগেই পণ্য পৌঁছানোর নিশ্চয়তা আমরা প্রদান করি।",
      panelBtn: "হোয়াটসঅ্যাপে ব্রাইডাল পরামর্শ ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20consult%20on%20the%20eMarket247%20Bridal%20Collection"
    }
  },
  eid: {
    en: {
      title: "Eid Jewellery & Festive Edits | eMarket247",
      metaDesc: "Celebrate Eid with radiant jewellery from eMarket247. Explore chandbalis, delicate chains, and sparkling bangles crafted for joyful prayers and evening dawats.",
      ogTitle: "Eid Jewellery & Festive Edits | eMarket247",
      ogDesc: "From peaceful morning prayers to evening feasts and Chaand Raat excitement, discover jewellery that carries the festive moment.",
      ogImage: "https://emarket247.shop/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      heroImg: "/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> Eid Edit',
      heroH1: "Celebrate Eid moments with radiant festive elegance.",
      heroP: "From the quiet joy of morning prayers to lively family feasts and chaand raat excitement, discover delicate earrings, graceful necklaces, and festive bangles tailored for festive harmony.",
      assuranceTitle: "eMarket247 Eid Shopping Assurance",
      assurance: [
        { title: "Pre-Eid Delivery Timelines", desc: "Clear cutoff schedules so your festive orders arrive well before Eid day without courier delays." },
        { title: "Authentic Studio Photography", desc: "No artificial luster or deceptive enhancements; what you view is what reaches your hands." },
        { title: "Complimentary Festive Gift", desc: "A special token included with every confirmed parcel to make your unboxing extra joyous." },
        { title: "Direct WhatsApp Support", desc: "Friendly guidance on matching pieces with salwar suits, kurtis, and festive silks." }
      ],
      catIntro: "Explore festive categories designed to brighten your Eid wardrobe from sunrise to twilight.",
      categories: [
        { name: "Earrings", sub: "Chandbalis, drops & festive studs", href: "/en/categories/earrings/" },
        { name: "Necklaces", sub: "Delicate chains & floral pendants", href: "/en/categories/necklaces/" },
        { name: "Bangles", sub: "Festive stackable bangles & chur", href: "/en/categories/bangles/" },
        { name: "Bracelets", sub: "Articulated charm & link designs", href: "/en/categories/bracelets/" },
        { name: "Rings", sub: "Cluster floral & adjustable bands", href: "/en/categories/rings/" },
        { name: "Gift Jewellery", sub: "Cherished Eidi keepsake pieces", href: "/en/categories/gift-jewellery/" }
      ],
      guideEyebrow: "Festive Moments & Styling",
      guideTitle: "Curated styling for each phase of Eid day",
      guides: [
        { num: "01", title: "Chaand Raat & Henna Evenings", text: "Lightweight bangle stacks and delicate charm bracelets that feel effortless while applying intricate mehendi patterns.", linkText: "Bangles Collection", href: "/en/categories/bangles/" },
        { num: "02", title: "Eid Morning Prayers & Breakfast", text: "Subtle floral studs and graceful lightweight chains offering serene elegance for morning greetings and prayer gatherings.", linkText: "Pendants Collection", href: "/en/categories/pendants/" },
        { num: "03", title: "Afternoon & Evening Dawats", text: "Statement chandbalis, multi-layered necklaces, and polished cocktail rings that catch the warm lights of celebratory dinners.", linkText: "Earrings Collection", href: "/en/categories/earrings/" },
        { num: "04", title: "Eidi & Lasting Gift Keepsakes", text: "Delight daughters, sisters, and close friends with memorable jewellery tokens that hold sentimental value across generations.", linkText: "Gift Collection", href: "/en/occasions/gifts/" }
      ],
      panelImg: "/assets/images/editorial/emarket247-gifting-puja-editorial.webp",
      panelCap: "eMarket247 Festive Eid Curation",
      panelEyebrow: "Calm Eid Preparation",
      panelH2: "Plan your Eid wardrobe without courier bottlenecks.",
      panelP1: "Festive seasons in Bangladesh bring notorious parcel congestion in the final days before Eid. eMarket247 provides early catalog visibility and swift district-wide dispatch so you can prepare comfortably in advance.",
      panelP2: "Transparent product specifications, exact weight indicators, and dedicated customer care ensure your Eid selections are made with complete peace of mind.",
      panelBtn: "Inquire on WhatsApp ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20inquire%20about%20the%20eMarket247%20Eid%20Collection"
    },
    bn: {
      title: "ঈদের জুয়েলারি ও উৎসবের গহনা | eMarket247",
      metaDesc: "ঈদের আনন্দের সাথে সাজুন eMarket247-এর স্নিগ্ধ ও উৎসবমুখর জুয়েলারিতে। চাঁদরাত থেকে শুরু করে দাওয়াত—সব মুহূর্তের জন্য চাঁদবালি, নেকলেস ও চুড়ি কালেকশন।",
      ogTitle: "ঈদের জুয়েলারি ও উৎসবের গহনা | eMarket247",
      ogDesc: "ঈদের আনন্দের সাথে সাজুন স্নিগ্ধ ও উৎসবমুখর অলংকারে। সকালের নামাজ থেকে সন্ধ্যার আড্ডা পর্যন্ত নান্দনিক গহনা।",
      ogImage: "https://emarket247.shop/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      heroImg: "/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> ঈদ এডিট',
      heroH1: "ঈদের আনন্দের সাথে সাজুন স্নিগ্ধ ও উৎসবমুখর অলংকারে।",
      heroP: "ঈদের সকালের মিষ্টি স্নিগ্ধতা থেকে সন্ধ্যার জমকালো পারিবারিক আড্ডা ও চাঁদরাতের উল্লাস—সব মুহূর্তের জন্য নিখুঁত, হালকা ও আরামদায়ক উৎসবের জুয়েলারি কালেকশন।",
      assuranceTitle: "eMarket247 ঈদ শপিং নিশ্চয়তা",
      assurance: [
        { title: "নির্ধারিত সময়ে ডেলিভারি", desc: "ঈদের আগেই যাতে পণ্য হাতে পান সেজন্য স্পষ্ট সময়সূচি ও দ্রুততম ট্র্যাকিং সুবিধা।" },
        { title: "বাস্তবসম্মত ছবি", desc: "কোনো কৃত্রিম চমক বা ফিল্টার নয়, বাস্তব পণ্যের সঠিক রূপ ও রঙের নিশ্চয়তা।" },
        { title: "প্রতিটি অর্ডারে বিশেষ উপহার", desc: "ঈদের আনন্দ দ্বিগুণ করতে প্রতিটি পার্সেলের সাথে থাকছে বিশেষ প্রশংসাসূচক উপহার।" },
        { title: "হোয়াটসঅ্যাপে সরাসরি পরামর্শ", desc: "পোশাকের ডিজাইনের সাথে অলংকার নির্বাচনের জন্য সার্বক্ষণিক আন্তরিক সহায়তা।" }
      ],
      catIntro: "ঈদের দিনের প্রতিটি মুহূর্তকে রঙিন করে তুলতে পছন্দের ক্যাটাগরি ঘুরে দেখুন।",
      categories: [
        { name: "কানের দুল", sub: "চাঁদবালি, ঝুমকা ও টপ", href: "/bn/categories/earrings/" },
        { name: "নেকলেস", sub: "হালকা চেইন ও লকেট সেট", href: "/bn/categories/necklaces/" },
        { name: "চুড়ি", sub: "কাঁচের ও সোনালি রঙের চুড়ি", href: "/bn/categories/bangles/" },
        { name: "ব্রেসলেট", sub: "আর্টিকুলেটেড ও চার্ম ব্রেসলেট", href: "/bn/categories/bracelets/" },
        { name: "আংটি", sub: "ফ্লোরাল ও অ্যাডজাস্টেবল আংটি", href: "/bn/categories/rings/" },
        { name: "উপহারের জুয়েলারি", sub: "ঈদের বিশেষ সালামি ও উপহার", href: "/bn/categories/gift-jewellery/" }
      ],
      guideEyebrow: "উৎসবের সাজ ও প্রস্তুতি",
      guideTitle: "ঈদের পুরো দিনের জন্য মানানসই অলংকার শৈলী",
      guides: [
        { num: "০১", title: "চাঁদরাত ও মেহেদির আসর", text: "হাতে মেহেদি দেওয়ার সময় পরার উপযোগী হালকা ব্রেসলেট ও মসৃণ চুড়ি, যা মেহেদির রঙ নষ্ট করবে না।", linkText: "চুড়ি কালেকশন", href: "/bn/categories/bangles/" },
        { num: "০২", title: "ঈদের সকালের নামাজ ও শুভেচ্ছা", text: "সকালের হালকা সুতি বা লিনেন পোশাকের সাথে মানানসই সাধারণ টপ কানের দুল ও স্নিগ্ধ লকেটের মার্জিত রূপ।", linkText: "লকেট কালেকশন", href: "/bn/categories/pendants/" },
        { num: "০৩", title: "সন্ধ্যায় দাওয়াত ও জমকালো আড্ডা", text: "কাতান বা সিল্কের পোশাকের সাথে উজ্জ্বল চাঁদবালি, বহুস্তরী নেকলেস ও স্টেটমেন্ট আংটির মনোমুগ্ধকর উপস্থিতি।", linkText: "কানের দুল কালেকশন", href: "/bn/categories/earrings/" },
        { num: "০৪", title: "ঈদ উপহার ও সালামি স্মারক", text: "বোন, ভাগনি বা প্রিয়জনকে ঈদে মিষ্টি স্মৃতি উপহার দিতে বিশেষ বক্স সহ দীর্ঘস্থায়ী জুয়েলারি উপহার।", linkText: "উপহার কালেকশন", href: "/bn/occasions/gifts/" }
      ],
      panelImg: "/assets/images/editorial/emarket247-gifting-puja-editorial.webp",
      panelCap: "eMarket247 ঈদ উৎসব কালেকশন",
      panelEyebrow: "শান্ত মনে ঈদের প্রস্তুতি",
      panelH2: "উৎসবের ভিড় এড়াতে শান্ত মনে ঈদের প্রস্তুতি নিন।",
      panelP1: "ঈদের ঠিক আগে কুরিয়ার সার্ভিসের অতিরিক্ত চাপ ও ডেলিভারি বিলম্ব ঘটে। তাই eMarket247-এর বিস্তারিত তথ্য ও ছবি দেখে আগেভাগেই পছন্দের অলংকার নির্বাচন করুন।",
      panelP2: "সঠিক পরিমাপ, বাস্তবসম্মত পণ্যের ছবি এবং নির্ভরযোগ্য পলিসির সাথে নিশ্চিত করুন আপনার পরিবারের ঈদের পরিপূর্ণ আনন্দ।",
      panelBtn: "হোয়াটসঅ্যাপে যোগাযোগ করুন ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20inquire%20about%20the%20eMarket247%20Eid%20Collection"
    }
  },
  anniversary: {
    en: {
      title: "Anniversary Jewellery & Milestone Gifts | eMarket247",
      metaDesc: "Mark shared milestones with eMarket247 anniversary jewellery. Explore infinity bands, romantic heart pendants, and timeless necklaces crafted for enduring love.",
      ogTitle: "Anniversary Jewellery & Milestone Gifts | eMarket247",
      ogDesc: "Celebrate years of companionship with eternal motifs—infinity bands, double-heart pendants, and radiant necklaces crafted to endure.",
      ogImage: "https://emarket247.shop/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      heroImg: "/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> Anniversary Edit',
      heroH1: "Mark shared milestones with timeless expressions of love.",
      heroP: "Celebrate years of companionship with eternal motifs—infinity bands, double-heart pendants, delicate bracelets, and radiant necklaces crafted to endure and shine through every chapter.",
      assuranceTitle: "eMarket247 Anniversary Shopping Assurance",
      assurance: [
        { title: "Discreet Gifting Support", desc: "Confidential WhatsApp consultation to preserve surprise elements for your partner." },
        { title: "15-Day Refund Promise", desc: "Shop without hesitation with our transparent, customer-first return and exchange policy." },
        { title: "Complimentary Keepsake Box", desc: "Every anniversary piece is presented in an elegant gift box ready for the romantic reveal." },
        { title: "Verified Purity & Craft", desc: "Honest materials and durable gold-tone electroplating built for lasting enjoyment." }
      ],
      catIntro: "Explore romantic categories designed to celebrate enduring milestones and heartfelt affection.",
      categories: [
        { name: "Rings", sub: "Infinity bands & heart cluster rings", href: "/en/categories/rings/" },
        { name: "Pendants", sub: "Romantic lockets & floral motifs", href: "/en/categories/pendants/" },
        { name: "Necklaces", sub: "Graceful focal pendants & chokers", href: "/en/categories/necklaces/" },
        { name: "Bracelets", sub: "Braided links & delicate charms", href: "/en/categories/bracelets/" },
        { name: "Earrings", sub: "Timeless solitaire drops & studs", href: "/en/categories/earrings/" },
        { name: "Jewellery Sets", sub: "Harmonious anniversary suites", href: "/en/categories/jewellery-sets/" }
      ],
      guideEyebrow: "Milestone Moments & Styling",
      guideTitle: "Curated styling for memorable anniversary celebrations",
      guides: [
        { num: "01", title: "The Intimate Candlelit Dinner", text: "Subtle neckline drops and shimmering stud earrings that catch ambient restaurant lighting without overwhelming your evening ensemble.", linkText: "Pendants Collection", href: "/en/categories/pendants/" },
        { num: "02", title: "Infinity & Eternal Bond Motifs", text: "Selecting rings and pendants carrying intertwining circular and heart motifs that symbolize unbroken fidelity and shared history.", linkText: "Rings Collection", href: "/en/categories/rings/" },
        { num: "03", title: "Everyday Keepsake Elegance", text: "Comfortable articulated bracelets and lightweight pendants designed to be worn continuously as daily reminders of affection.", linkText: "Bracelets Collection", href: "/en/categories/bracelets/" },
        { num: "04", title: "Major Milestone Celebrations", text: "Commemorating 5th, 10th, or 25th wedding anniversaries with coordinated multi-piece suites presented in keepsake packaging.", linkText: "Jewellery Sets", href: "/en/categories/jewellery-sets/" }
      ],
      panelImg: "/assets/images/editorial/emarket247-bridal-occasion-editorial.webp",
      panelCap: "eMarket247 Anniversary Keepsake Collection",
      panelEyebrow: "A Gift of Permanence",
      panelH2: "A gift of permanence for a love that grows.",
      panelP1: "Flowers wilt and celebrations pass, but a thoughtfully chosen piece of jewellery becomes part of your partner's everyday identity. At eMarket247, we assist you in selecting the right ring size and necklace length with patient, factual advice.",
      panelP2: "Our transparent product catalog lists exact measurements, metal specifications, and real-life photos, giving you the certainty to surprise your loved one effortlessly.",
      panelBtn: "Inquire on WhatsApp ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20inquire%20about%20the%20eMarket247%20Anniversary%20Collection"
    },
    bn: {
      title: "বিবাহবার্ষিকীর জুয়েলারি ও উপহার | eMarket247",
      metaDesc: "ভালোবাসার পথচলা উদযাপনে eMarket247-এর বিবাহবার্ষিকী জুয়েলারি কালেকশন। ইনফিনিটি আংটি, হার্ট লকেট ও চিরন্তন নেকলেস—প্রতিটি সম্পর্কের বিশেষ স্মারক।",
      ogTitle: "বিবাহবার্ষিকীর জুয়েলারি ও উপহার | eMarket247",
      ogDesc: "একসাথে কাটানো ভালোবাসার পথচলা উদযাপনে চিরন্তন অলংকার। ইনফিনিটি আংটি, ডাবল-হার্ট লকেট এবং মার্জিত নেকলেস।",
      ogImage: "https://emarket247.shop/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      heroImg: "/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> বার্ষিকী এডিট',
      heroH1: "একসাথে কাটানো ভালোবাসার পথচলা উদযাপনে চিরন্তন অলংকার।",
      heroP: "ভালোবাসার বিশেষ মুহূর্তগুলোকে অমর করে রাখতে ইনফিনিটি আংটি, ডাবল-হার্ট লকেট এবং মার্জিত নেকলেস—প্রতিটি সম্পর্ক ও স্মৃতির জন্য অনন্য ও দীর্ঘস্থায়ী উপহার।",
      assuranceTitle: "eMarket247 বার্ষিকী শপিং নিশ্চয়তা",
      assurance: [
        { title: "গোপনীয় উপহার সহায়তা", desc: "সঙ্গীকে চমকে দিতে গোপনীয়তা বজায় রেখে হোয়াটসঅ্যাপে পরামর্শ ও অর্ডারের সুযোগ।" },
        { title: "১৫ দিনের রিফান্ড পলিসি", desc: "কোনো দ্বিধা ছাড়াই কেনাকাটা করুন আমাদের নির্ভরযোগ্য ও সহজ রিটার্ন নিয়মে।" },
        { title: "আকর্ষণীয় গিফট বক্স", desc: "প্রতিটি বার্ষিকীর গহনা ডেলিভারি করা হয় চমৎকার প্রিমিয়াম গিফট বক্সে।" },
        { title: "স্থায়িত্ব ও নিখুঁত কারুকাজ", desc: "উন্নত গোল্ড-টোন প্লেটিং ও দীর্ঘস্থায়ী ফিনিশিং যা বহু বছর ধরে অক্ষুণ্ণ থাকবে।" }
      ],
      catIntro: "ভালোবাসার বিশেষ মুহূর্ত উদযাপনে পছন্দের ক্যাটাগরি থেকে বেছে নিন মনের মতো উপহার।",
      categories: [
        { name: "আংটি", sub: "ইনফিনিটি ও কাপল ব্যান্ড", href: "/bn/categories/rings/" },
        { name: "লকেট", sub: "রোমান্টিক হার্ট ও ফ্লোরাল লকেট", href: "/bn/categories/pendants/" },
        { name: "নেকলেস", sub: "মার্জিত ও নজরকাড়া নেকলেস", href: "/bn/categories/necklaces/" },
        { name: "ব্রেসলেট", sub: "চার্ম ও চেইন ব্রেসলেট", href: "/bn/categories/bracelets/" },
        { name: "কানের দুল", sub: "সলিটেয়ার ড্রপস ও স্টাড", href: "/bn/categories/earrings/" },
        { name: "জুয়েলারি সেট", sub: "সমন্বিত বার্ষিকী উপহার সেট", href: "/bn/categories/jewellery-sets/" }
      ],
      guideEyebrow: "স্মরণীয় মুহূর্ত ও অলংকার শৈলী",
      guideTitle: "বার্ষিকীর বিশেষ মুহূর্তগুলোর জন্য মানানসই গহনা",
      guides: [
        { num: "০১", title: "ক্যান্ডেললাইট ডিনারের রূপ", text: "মোমবাতির মৃদু আলোয় জ্বলজ্বল করে এমন হালকা লকেট ও ছোট কানের দুল যা সান্ধ্য পোশাকের সাথে অনবদ্য দেখায়।", linkText: "লকেট কালেকশন", href: "/bn/categories/pendants/" },
        { num: "০২", title: "ইনফিনিটি ও অটুট বন্ধন", text: "চিরন্তন ভালোবাসা ও অটুট সম্পর্কের প্রতীক হিসেবে ইনফিনিটি প্যাটার্নের আংটি ও পেন্ডেন্টের গভীর অর্থবহ আবেদন।", linkText: "আংটি কালেকশন", href: "/bn/categories/rings/" },
        { num: "০৩", title: "নিত্যদিনের স্মৃতিময় অলংকার", text: "প্রতিদিনের ব্যবহারের উপযোগী আরামদায়ক ব্রেসলেট ও হালকা চেইন যা সবসময় আপনার ভালোবাসার কথা মনে করিয়ে দেবে।", linkText: "ব্রেসলেট কালেকশন", href: "/bn/categories/bracelets/" },
        { num: "০৪", title: "বিশেষ মাইলফলক উদযাপন", text: "৫ম, ১০ম বা ২৫তম বিবাহবার্ষিকীর মতো বড় অর্জনে পূর্ণাঙ্গ জুয়েলারি সেট উপহার দিয়ে মুহূর্তটিকে করুন অবিস্মরণীয়।", linkText: "জুয়েলারি সেট", href: "/bn/categories/jewellery-sets/" }
      ],
      panelImg: "/assets/images/editorial/emarket247-bridal-occasion-editorial.webp",
      panelCap: "eMarket247 বার্ষিকী স্মারক কালেকশন",
      panelEyebrow: "চিরন্তন উপহারের নিশ্চয়তা",
      panelH2: "ভালোবাসা ও আস্থার স্থায়ী স্মারক।",
      panelP1: "ফুল একসময় শুকিয়ে যায়, কিন্তু ভালোবেসে উপহার দেওয়া এক টুকরো অলংকার প্রিয়জনের সাথে থাকে আজীবন। eMarket247-এ আমরা সঠিক সাইজ ও ডিজাইন বেছে নিতে আন্তরিকভাবে সাহায্য করি।",
      panelP2: "সঠিক পরিমাপ ও কোনো ধরনের কৃত্রিমতা ছাড়া বাস্তব ছবি দেখে নিশ্চিত হয়ে সঙ্গীর মুখে হাসি ফোটাতে উপহার নির্বাচন করুন।",
      panelBtn: "হোয়াটসঅ্যাপে যোগাযোগ করুন ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20inquire%20about%20the%20eMarket247%20Anniversary%20Collection"
    }
  },
  birthday: {
    en: {
      title: "Birthday Jewellery & Keepsake Presents | eMarket247",
      metaDesc: "Discover thoughtful birthday jewellery gifts at eMarket247. Sparkling studs, charming pendants, and versatile rings packaged ready to delight loved ones.",
      ogTitle: "Birthday Jewellery & Keepsake Presents | eMarket247",
      ogDesc: "Whether celebrating your own special milestone or delighting a sister, friend, or mother, explore sparkling earrings, charming pendants, and versatile rings.",
      ogImage: "https://emarket247.shop/assets/images/editorial/emarket247-gifting-puja-editorial.webp",
      heroImg: "/assets/images/editorial/emarket247-gifting-puja-editorial.webp",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> Birthday Edit',
      heroH1: "Thoughtful sparkle for another cherished year.",
      heroP: "Whether celebrating your own special milestone or delighting a sister, friend, or mother, explore sparkling earrings, charming pendants, and versatile rings curated for personal joy.",
      assuranceTitle: "eMarket247 Birthday Shopping Assurance",
      assurance: [
        { title: "Guaranteed On-Time Dispatch", desc: "Reliable courier timelines across Bangladesh so your birthday surprise arrives right on the day." },
        { title: "Complimentary Handwritten Note", desc: "Request a custom personalized birthday message tucked carefully inside the parcel." },
        { title: "Hassle-Free Size Exchanges", desc: "Flexible exchange options for rings and bangles if sizing needs adjustment after opening." },
        { title: "WhatsApp Gifting Concierge", desc: "Get recommendations tailored to her personal style, age, and your gifting budget." }
      ],
      catIntro: "Explore sparkling categories designed to make birthdays radiant, personal, and memorable.",
      categories: [
        { name: "Earrings", sub: "Versatile studs, huggies & drops", href: "/en/categories/earrings/" },
        { name: "Pendants", sub: "Charming everyday motifs & stones", href: "/en/categories/pendants/" },
        { name: "Rings", sub: "Playful floral clusters & bands", href: "/en/categories/rings/" },
        { name: "Bracelets", sub: "Dainty link chains & charm cuffs", href: "/en/categories/bracelets/" },
        { name: "Necklaces", sub: "Contemporary layered chains", href: "/en/categories/necklaces/" },
        { name: "Gift Jewellery", sub: "Curated birthday presentation sets", href: "/en/categories/gift-jewellery/" }
      ],
      guideEyebrow: "Birthday Moments & Styling",
      guideTitle: "Curated styling ideas for birthday celebrations",
      guides: [
        { num: "01", title: "Birthday Brunch & Daytime Chic", text: "Minimalist floral studs, delicate pendant chains, and comfortable rings for relaxed celebrations with close friends.", linkText: "Earrings Collection", href: "/en/categories/earrings/" },
        { num: "02", title: "Evening Birthday Party Glamour", text: "Eye-catching chandelier earrings and sparkling cluster rings that command attention under evening celebratory party lights.", linkText: "Rings Collection", href: "/en/categories/rings/" },
        { num: "03", title: "The Best Friend's Keepsake Gift", text: "Playful charm bracelets and trendy adjustable rings that feel intimate, thoughtful, and effortlessly stylish.", linkText: "Bracelets Collection", href: "/en/categories/bracelets/" },
        { num: "04", title: "A Cherished Gift for Mother", text: "Timeless filigree pendants and classic gold-tone pieces expressing deep affection and heartfelt gratitude.", linkText: "Pendants Collection", href: "/en/categories/pendants/" }
      ],
      panelImg: "/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      panelCap: "eMarket247 Birthday Keepsake Collection",
      panelEyebrow: "Gifting with Certainty",
      panelH2: "A birthday gift that lasts far beyond the cake.",
      panelP1: "Finding a birthday gift that feels personal and enduring shouldn't involve guessing games. eMarket247 provides factual photos, exact dimensions, and honest weight specifications for every single item in our catalog.",
      panelP2: "Our customer care team on WhatsApp is ready to guide you toward the ideal piece, coordinate delivery timing, and include special gift packaging at no extra charge.",
      panelBtn: "Inquire on WhatsApp ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20inquire%20about%20the%20eMarket247%20Birthday%20Collection"
    },
    bn: {
      title: "জন্মদিনের জুয়েলারি ও গিফট কালেকশন | eMarket247",
      metaDesc: "জন্মদিনের আনন্দ ও হাসিকে উজ্জ্বল করতে eMarket247-এর নান্দনিক জুয়েলারি উপহার। বোন, মা বা প্রিয় বন্ধুর জন্য কানের দুল, লকেট ও আংটি কালেকশন।",
      ogTitle: "জন্মদিনের জুয়েলারি ও গিফট কালেকশন | eMarket247",
      ogDesc: "নিজের বিশেষ দিন উদযাপন হোক কিংবা প্রিয়জনের জন্য সারপ্রাইজ—প্রতিটি হাসির জন্য নান্দনিক কানের দুল, লকেট ও আংটি।",
      ogImage: "https://emarket247.shop/assets/images/editorial/emarket247-gifting-puja-editorial.webp",
      heroImg: "/assets/images/editorial/emarket247-gifting-puja-editorial.webp",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> জন্মদিন এডিট',
      heroH1: "জন্মদিনের আনন্দ ও হাসিকে উজ্জ্বল করতে বিশেষ উপহার।",
      heroP: "নিজের বিশেষ দিন উদযাপন হোক কিংবা মা, বোন বা প্রিয় বন্ধুর জন্য সারপ্রাইজ—প্রতিটি হাসির জন্য নান্দনিক কানের দুল, লকেট ও আংটির চমৎকার কালেকশন।",
      assuranceTitle: "eMarket247 জন্মদিন শপিং নিশ্চয়তা",
      assurance: [
        { title: "নির্দিষ্ট দিনে ডেলিভারির নিশ্চয়তা", desc: "জন্মদিনের ঠিক সময়ে উপহার পৌঁছে দিতে দ্রুত ও সুনির্দিষ্ট ট্র্যাকিং সহ ডেলিভারি সুবিধা।" },
        { title: "ফ্রি জন্মদিনের শুভেচ্ছা কার্ড", desc: "অনুরোধ করলেই পার্সেলের সাথে যুক্ত করে দেওয়া হয় আপনার লেখা ব্যক্তিগত শুভেচ্ছা বার্তা।" },
        { title: "সহজ সাইজ পরিবর্তনের সুযোগ", desc: "উপহারের আংটি বা চুড়ির সাইজে কোনো অমিল হলে দ্রুত পরিবর্তনের নিশ্চয়তা।" },
        { title: "হোয়াটসঅ্যাপে উপহার নির্বাচন সহায়তা", desc: "বাজেট ও পছন্দের সাথে মানানসই উপহার বেছে নিতে আমাদের পরামর্শকদের সহায়তা নিন।" }
      ],
      catIntro: "জন্মদিনের আনন্দকে আরও বর্ণিল করতে পছন্দের ক্যাটাগরিগুলো ঘুরে দেখুন।",
      categories: [
        { name: "কানের দুল", sub: "স্টাড, হাগিস ও ড্রপস", href: "/bn/categories/earrings/" },
        { name: "লকেট", sub: "হালকা ও স্টাইলিশ লকেট", href: "/bn/categories/pendants/" },
        { name: "আংটি", sub: "ফ্লোরাল ও ট্রেন্ডি আংটি", href: "/bn/categories/rings/" },
        { name: "ব্রেসলেট", sub: "চার্ম ও চেইন ব্রেসলেট", href: "/bn/categories/bracelets/" },
        { name: "নেকলেস", sub: "আধুনিক লেয়ার্ড চেইন", href: "/bn/categories/necklaces/" },
        { name: "উপহারের জুয়েলারি", sub: "জন্মদিনের বিশেষ উপহার সেট", href: "/bn/categories/gift-jewellery/" }
      ],
      guideEyebrow: "জন্মদিনের সাজ ও উপহার",
      guideTitle: "জন্মদিনের উদযাপনের জন্য দারুণ সব জুয়েলারি আইডিয়া",
      guides: [
        { num: "০১", title: "দিনের বেলার আড্ডা ও ব্রাঞ্চ", text: "বন্ধু-বান্ধবদের সাথে আড্ডায় হালকা ফ্লোরাল স্টাড ও সাধারণ লকেট যা এনে দেয় স্বাচ্ছন্দ্যময় ও প্রাণবন্ত লুক।", linkText: "কানের দুল কালেকশন", href: "/bn/categories/earrings/" },
        { num: "০২", title: "সন্ধ্যার বার্থডে পার্টি গ্ল্যামার", text: "জমকালো পার্টির জন্য স্টেটমেন্ট কানের দুল ও নজরকাড়া ক্লাস্টার আংটি যা উৎসবমুখর পরিবেশের সাথে পুরোপুরি মানিয়ে যায়।", linkText: "আংটি কালেকশন", href: "/bn/categories/rings/" },
        { num: "০৩", title: "প্রিয় বান্ধবীর জন্য উপহার", text: "ট্রেন্ডি চার্ম ব্রেসলেট ও অ্যাডজাস্টেবল রিং যা বর্তমান ফ্যাশনের সাথে মানানসই এবং নিখুঁত স্মৃতিচিহ্ন।", linkText: "ব্রেসলেট কালেকশন", href: "/bn/categories/bracelets/" },
        { num: "০৪", title: "মায়ের জন্য ভালোবাসার উপহার", text: "মায়ের স্নেহ ও অবদানের প্রতি সম্মান জানাতে চিরন্তন ফিলিগ্রি লকেট বা ক্লাসিক গোল্ড-টোন জুয়েলারি।", linkText: "লকেট কালেকশন", href: "/bn/categories/pendants/" }
      ],
      panelImg: "/assets/images/editorial/emarket247-hero-vermilion-atelier.webp",
      panelCap: "eMarket247 জন্মদিনের উপহার কালেকশন",
      panelEyebrow: "নিশ্চিন্তে উপহার নির্বাচন",
      panelH2: "ক্ষণিকের উপহার নয়, দীর্ঘদিনের স্মৃতিময় আনন্দ।",
      panelP1: "জন্মদিনের জন্য অর্থবহ উপহার নির্বাচন করা এখন অত্যন্ত সহজ। eMarket247-এ প্রতিটি গহনার বাস্তব ছবি ও সঠিক মাপ দেখে আপনি নিশ্চিন্তে প্রিয়জনের পছন্দের সাথে মেলাতে পারবেন।",
      panelP2: "হোয়াটসঅ্যাপে আমাদের সাথে সরাসরি কথা বলে ডেলিভারির সময় নির্ধারণ এবং উপহারের সাথে বিশেষ নোট পাঠানোর সুবিধা গ্রহণ করুন।",
      panelBtn: "হোয়াটসঅ্যাপে যোগাযোগ করুন ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20inquire%20about%20the%20eMarket247%20Birthday%20Collection"
    }
  },
  gifts: {
    en: {
      title: "Jewellery Gifts & Curated Presents | eMarket247",
      metaDesc: "Gift with intention, clarity, and enduring sentiment with eMarket247. Explore thoughtful jewellery boxes, classic pendants, and versatile earrings packaged with care.",
      ogTitle: "Jewellery Gifts & Curated Presents | eMarket247",
      ogDesc: "Meaningful jewellery needs no extravagant pretext. Explore curated gift boxes, classic pendants, and versatile earrings packaged with complimentary care.",
      ogImage: "https://emarket247.shop/assets/images/editorial/emarket247-gifting-puja-editorial.webp",
      heroImg: "/assets/images/editorial/emarket247-gifting-puja-editorial.webp",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> Gifts Edit',
      heroH1: "Gift with intention, clarity, and enduring sentiment.",
      heroP: "Meaningful jewellery needs no extravagant pretext. Explore curated gift boxes, classic pendants, and versatile earrings packaged with complimentary care and thoughtful presentation.",
      assuranceTitle: "eMarket247 Gifting Shopping Assurance",
      assurance: [
        { title: "Complimentary Surprise Gift", desc: "A special additional accessory included inside every confirmed parcel as our heartfelt thank you." },
        { title: "Presentation-Ready Packaging", desc: "Luxury gift boxes finished with protective interior lining, ready for immediate presentation." },
        { title: "Universal-Fit Options", desc: "Extensive selection of pendants and adjustable chains that require no prior sizing guesswork." },
        { title: "Pan-Bangladesh Express Delivery", desc: "Fast, reliable dispatch reaching all 64 districts with transparent tracking milestones." }
      ],
      catIntro: "Explore gifting categories curated to convey gratitude, admiration, and lifelong affection.",
      categories: [
        { name: "Gift Jewellery", sub: "Curated bestsellers for gifting", href: "/en/categories/gift-jewellery/" },
        { name: "Pendants", sub: "Effortless fit with no sizing barrier", href: "/en/categories/pendants/" },
        { name: "Earrings", sub: "Flattering studs & classic drops", href: "/en/categories/earrings/" },
        { name: "Bracelets", sub: "Adjustable links & charm cuffs", href: "/en/categories/bracelets/" },
        { name: "Jewellery Sets", sub: "Harmonious all-in-one presentations", href: "/en/categories/jewellery-sets/" },
        { name: "Rings", sub: "Adjustable & timeless band rings", href: "/en/categories/rings/" }
      ],
      guideEyebrow: "Gifting Wisdom & Styling",
      guideTitle: "Thoughtful guidance for gifting jewellery with confidence",
      guides: [
        { num: "01", title: "Universal Fit Without Sizing Stress", text: "Pendants and stud earrings eliminate the anxiety of measuring finger diameters, ensuring immediate wearability.", linkText: "Pendants Collection", href: "/en/categories/pendants/" },
        { num: "02", title: "Gifts for Sisters & Young Daughters", text: "Lighthearted floral charms, delicate huggie earrings, and polished bangles tailored for modern youthful aesthetics.", linkText: "Earrings Collection", href: "/en/categories/earrings/" },
        { num: "03", title: "Honoring Mothers & Mentors", text: "Traditional filigree necklace pendants and dignified classic bangles that radiate warmth, heritage, and respect.", linkText: "Bangles Collection", href: "/en/categories/bangles/" },
        { num: "04", title: "Congratulatory & Career Milestones", text: "Polished, understated pieces that celebrate graduations, promotions, and personal accomplishments with refined grace.", linkText: "Gift Jewellery Sets", href: "/en/categories/gift-jewellery/" }
      ],
      panelImg: "/assets/images/editorial/Shop.png",
      panelCap: "eMarket247 Curated Gift Presentation",
      panelEyebrow: "The Joy of Thoughtful Giving",
      panelH2: "No guesswork. No inflated claims. Just pure appreciation.",
      panelP1: "When giving jewellery, you want the recipient to experience genuine delight from the moment the parcel opens. eMarket247 packs every item with extreme care, includes a free surprise accessory, and ensures pristine box condition.",
      panelP2: "Our 15-day refund promise and clear product photography mean your generosity is backed by total integrity and consumer protection.",
      panelBtn: "Inquire on WhatsApp ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20inquire%20about%20the%20eMarket247%20Gifts%20Collection"
    },
    bn: {
      title: "জুয়েলারি উপহার ও গিফট কালেকশন | eMarket247",
      metaDesc: "ভালোবাসা ও কৃতজ্ঞতা প্রকাশের শ্রেষ্ঠ মাধ্যম eMarket247 জুয়েলারি উপহার। মা, বোন বা সঙ্গীর মুখে হাসি ফোটাতে নান্দনিক লকেট, কানের দুল ও চমৎকার জুয়েলারি সেট।",
      ogTitle: "জুয়েলারি উপহার ও গিফট কালেকশন | eMarket247",
      ogDesc: "হৃদয়ের আন্তরিক প্রকাশ—ভালোবাসার জন্য বিশেষ জুয়েলারি উপহার। কোনো দ্বিধা ছাড়াই সেরা উপহার বেছে নেওয়ার নিশ্চয়তা।",
      ogImage: "https://emarket247.shop/assets/images/editorial/emarket247-gifting-puja-editorial.webp",
      heroImg: "/assets/images/editorial/emarket247-gifting-puja-editorial.webp",
      heroEyebrow: '<strong class="brand-name">eMarket247</strong> উপহার এডিট',
      heroH1: "হৃদয়ের আন্তরিক প্রকাশ—ভালোবাসার জন্য বিশেষ জুয়েলারি উপহার।",
      heroP: "উপহার হোক চিরন্তন ও অর্থবহ। মা, বোন, জীবনসঙ্গী কিংবা বন্ধুর মুখে হাসি ফোটাতে নান্দনিক লকেট, কানের দুল ও চমৎকার জুয়েলারি সেটের নির্ভরযোগ্য কালেকশন।",
      assuranceTitle: "eMarket247 উপহার শপিং নিশ্চয়তা",
      assurance: [
        { title: "প্রতি অর্ডারে প্রশংসাসূচক উপহার", desc: "আমাদের পক্ষ থেকে প্রতিটি পার্সেলের সাথে দেওয়া হয় একটি চমৎকার সারপ্রাইজ গিফট।" },
        { title: "উপহার উপযোগী বিলাসবহুল বক্স", desc: "সরাসরি উপহার দেওয়ার উপযোগী নিখুঁত ও সুন্দর প্যাকেজিংয়ে প্রতিটি পণ্য পাঠানো হয়।" },
        { title: "সাইজের ঝামেলাহীন অপশন", desc: "লকেট ও কানের দুলের মতো অলংকারগুলোতে সাইজ মাপার কোনো জটিলতা থাকে না।" },
        { title: "সমগ্র বাংলাদেশে দ্রুত ডেলিভারি", desc: "৬৪টি জেলাতেই সময়মতো ও নিরাপদে পার্সেল পৌঁছে দেওয়ার সুব্যবস্থা।" }
      ],
      catIntro: "ভালোবাসা ও কৃতজ্ঞতা প্রকাশের জন্য মানানসই উপহারের ক্যাটাগরি ঘুরে দেখুন।",
      categories: [
        { name: "উপহারের জুয়েলারি", sub: "সেরা পছন্দের উপহারের তালিকা", href: "/bn/categories/gift-jewellery/" },
        { name: "লকেট", sub: "সাইজ মাপার ঝামেলাহীন চিরন্তন উপহার", href: "/bn/categories/pendants/" },
        { name: "কানের দুল", sub: "সব ধরণের মুখে মানানসই কানের দুল", href: "/bn/categories/earrings/" },
        { name: "ব্রেসলেট", sub: "অ্যাডজাস্টেবল ও চার্ম ব্রেসলেট", href: "/bn/categories/bracelets/" },
        { name: "জুয়েলারি সেট", sub: "পরিপূর্ণ ও স্মরণীয় উপহার সেট", href: "/bn/categories/jewellery-sets/" },
        { name: "আংটি", sub: "ফ্রি-সাইজ ও আকর্ষণীয় রিং", href: "/bn/categories/rings/" }
      ],
      guideEyebrow: "উপহার নির্বাচনের পরামর্শ",
      guideTitle: "সঠিক ও অর্থবহ জুয়েলারি উপহার নির্বাচনের সহজ উপায়",
      guides: [
        { num: "০১", title: "সাইজের দুশ্চিন্তামুক্ত উপহার", text: "পেন্ডেন্ট ও কানের দুল উপহার দিলে সাইজ ভুল হওয়ার কোনো ভয় থাকে না, যা সহজেই সবাই পরতে পারেন।", linkText: "লকেট কালেকশন", href: "/bn/categories/pendants/" },
        { num: "০২", title: "বোন ও কন্যাদের জন্য উপহার", text: "তরুণ প্রজন্মের পছন্দের কথা ভেবে আধুনিক ও মার্জিত হালকা ডিজাইনের কানের দুল ও ব্রেসলেট।", linkText: "কানের দুল কালেকশন", href: "/bn/categories/earrings/" },
        { num: "০৩", title: "মায়ের প্রতি শ্রদ্ধা ও ভালোবাসার স্মারক", text: "মায়েদের আভিজাত্যের সাথে মানানসই ঐতিহ্যবাহী ফিলিগ্রি কাজের নেকলেস বা স্বর্ণালি বালা।", linkText: "চুড়ি কালেকশন", href: "/bn/categories/bangles/" },
        { num: "০৪", title: "সাফল্য ও নতুন অর্জনের শুভেচ্ছা", text: "গ্র্যাজুয়েশন বা কর্মক্ষেত্রের পদোন্নতির মতো সাফল্যে উৎসাহ দিতে পরিশীলিত ও মার্জিত গহনা।", linkText: "উপহারের জুয়েলারি সেট", href: "/bn/categories/gift-jewellery/" }
      ],
      panelImg: "/assets/images/editorial/Shop.png",
      panelCap: "eMarket247 উপহার প্যাকেজিং",
      panelEyebrow: "উপহার দেওয়ার আনন্দ",
      panelH2: "কোনো দ্বিধা ছাড়াই সেরা উপহার বেছে নেওয়ার নিশ্চয়তা।",
      panelP1: "উপহার পাওয়ার মুহূর্তটি তখনই আনন্দময় হয় যখন প্যাকেজিং থেকে শুরু করে পণ্যের গুণমান সবকিছু নিখুঁত থাকে। eMarket247-এর প্রতিটি উপহারের বক্সে থাকে বিশেষ সুরক্ষা ও নান্দনিকতা।",
      panelP2: "১৫ দিনের রিফান্ড পলিসি এবং সত্য তথ্যের নিশ্চয়তা নিয়ে প্রিয়জনকে উপহার দিন ভালোবাসা ও আস্থার স্মারক।",
      panelBtn: "হোয়াটসঅ্যাপে যোগাযোগ করুন ↗",
      waText: "Hello%2C%20I%20would%20like%20to%20inquire%20about%20the%20eMarket247%20Gifts%20Collection"
    }
  }
};

const SVG_ICONS = {
  consultation: `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.7 8.7 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 12.5 3a8.4 8.4 0 0 1 8.5 8.5Z"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2L9 5h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"/><circle cx="12" cy="13" r="3.2"/></svg>`,
  delivery: `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 5.6v5.2c0 4.3 2.9 8.2 7 9.2 4.1-1 7-4.9 7-9.2V5.6L12 3Z"/><path d="m9 12 2.2 2.2L15.2 10"/></svg>`
};

function buildOccasionMain(lang, occKey, occData) {
  const d = occData[lang];
  const isBn = lang === "bn";

  const catHeadEyebrow = isBn ? "ক্যাটাগরি থেকে শুরু" : "Start by category";
  const catHeadH2 = isBn ? "ছবি, তথ্য এবং পছন্দের জন্য আলাদা স্থান।" : "Space for images, detail, and the right choice.";

  const guideLinkText = isBn ? "সব সহায়িকা দেখুন →" : "All Style Guides →";

  const trustEyebrow = isBn ? "কেন eMarket247" : "The eMarket247 Standard";
  const trustH2 = isBn ? "তথ্য দিয়ে শুরু করি, প্রতিশ্রুতি দিয়ে নয়।" : "Founded on facts, not speculative promises.";
  const trust1Title = isBn ? "ফটোগ্রাফি ও স্বচ্ছতা" : "Photographic Integrity";
  const trust1Desc = isBn ? "স্টুডিওতে তোলা বাস্তব ছবি পণ্যের আসল রঙ, পাথরের ঔজ্জ্বল্য ও নিখুঁত গঠন তুলে ধরে।" : "Unfiltered studio captures represent color tone, gemstone texture, and dimensional balance with factual honesty.";
  const trust2Title = isBn ? "সঠিক তথ্যের নিশ্চয়তা" : "Informed Decisions";
  const trust2Desc = isBn ? "যত্ন সহায়িকা ও সঠিক পরিমাপ দেখে আপনি আপনার পোশাকের সাথে মানিয়ে নিশ্চিতভাবে গহনা নির্বাচন করতে পারবেন।" : "Care guidance and clear dimensions allow you to select pieces suited to your wardrobe with certainty.";
  const trust3Title = isBn ? "উভয় ভাষায় সেবার ব্যবস্থা" : "Bilingual Assistance";
  const trust3Desc = isBn ? "ইংরেজি ও বাংলা উভয় ভাষায় সম্পূর্ণ ক্যাটালগ ও গ্রাহক সেবা সবসময় প্রস্তুত আপনার সহায়তায়।" : "Full catalog exploration and direct customer consultation in both English and Bengali.";

  const allOccasionsBtn = isBn ? "সব উপলক্ষ দেখুন" : "All Occasions";
  const exploreBtn = isBn ? "কালেকশন দেখুন →" : "Explore Collection →";

  return `<main id="main"><section class="editorial-hero full-width-hero occasion-hero"><img class="hero-bg" src="${d.heroImg}" width="1664" height="2080" alt="${d.ogTitle}" fetchpriority="high"><div class="hero-shade"></div><div class="wrap"><div class="hero-content hero-editorial-col"><p class="eyebrow">${d.heroEyebrow}</p><h1>${d.heroH1}</h1><p>${d.heroP}</p><div class="hero-actions"><a class="button hero-btn-primary" href="/${lang}/shop/">${exploreBtn}</a><a class="button hero-btn-secondary" href="/${lang}/occasions/">${allOccasionsBtn}</a></div></div></div></section><section class="assurance-strip" aria-label="${d.assuranceTitle}"><div class="wrap"><ul><li>${SVG_ICONS.consultation}<div><strong>${d.assurance[0].title}</strong><span>${d.assurance[0].desc}</span></div></li><li>${SVG_ICONS.camera}<div><strong>${d.assurance[1].title}</strong><span>${d.assurance[1].desc}</span></div></li><li>${SVG_ICONS.delivery}<div><strong>${d.assurance[2].title}</strong><span>${d.assurance[2].desc}</span></div></li><li>${SVG_ICONS.shield}<div><strong>${d.assurance[3].title}</strong><span>${d.assurance[3].desc}</span></div></li></ul></div></section><section class="occasion-detail wrap"><div><p class="eyebrow">${catHeadEyebrow}</p><h2>${catHeadH2}</h2><p style="color:var(--muted);font-size:14px;line-height:1.6;margin-top:14px;">${d.catIntro}</p></div><div class="occasion-links">${d.categories.map(c => `<a href="${c.href}"><span>${c.name} <small style="color:var(--muted);font-size:11px;display:block;">${c.sub}</small></span><b>→</b></a>`).join("")}</div></section><section class="wrap" style="padding-bottom:clamp(50px,7vw,90px);"><div class="section-head" style="margin-bottom:32px;"><div><p class="eyebrow">${d.guideEyebrow}</p><h2>${d.guideTitle}</h2></div><a href="/${lang}/guides/">${guideLinkText}</a></div><div class="guide-list">${d.guides.map(g => `<article><span>${g.num}</span><h2>${g.title}</h2><p>${g.text}</p><a href="${g.href}">${g.linkText} →</a></article>`).join("")}</div></section><section class="two-panel wrap"><figure><img src="${d.panelImg}" width="1664" height="2080" loading="lazy" alt="${d.panelCap}"><figcaption>${d.panelCap}</figcaption></figure><div><p class="eyebrow">${d.panelEyebrow}</p><h2>${d.panelH2}</h2><p>${d.panelP1}</p><p>${d.panelP2}</p><a class="button button-dark" href="https://wa.me/8801740501062?text=${d.waText}" target="_blank" rel="noopener">${d.panelBtn}</a></div></section><section class="trust-grid wrap"><div><p class="eyebrow">${trustEyebrow}</p><h2>${trustH2}</h2></div><ol><li><b>${isBn ? "০১" : "01"}</b><div><strong>${trust1Title}</strong><p>${trust1Desc}</p></div></li><li><b>${isBn ? "০২" : "02"}</b><div><strong>${trust2Title}</strong><p>${trust2Desc}</p></div></li><li><b>${isBn ? "০৩" : "03"}</b><div><strong>${trust3Title}</strong><p>${trust3Desc}</p></div></li></ol></section></main>`;
}

async function updateOccasionPage(relPath, lang, occKey) {
  const occData = OCCASIONS_DATA[occKey];
  if (!occData) return;

  const trees = ["public_html"];
  for (const tree of trees) {
    const fullPath = path.join(root, tree, relPath);
    try {
      let content = await readFile(fullPath, "utf8");

      // Replace <title>
      content = content.replace(/<title>[^<]*<\/title>/i, `<title>${occData[lang].title}</title>`);
      // Replace meta description
      content = content.replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${occData[lang].metaDesc}">`);
      // Replace og:title
      content = content.replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${occData[lang].ogTitle}">`);
      // Replace og:description
      content = content.replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${occData[lang].ogDesc}">`);
      // Replace og:image
      content = content.replace(/<meta property="og:image" content="[^"]*">/i, `<meta property="og:image" content="${occData[lang].ogImage}">`);

      // Replace <main id="main">...</main>
      const newMain = buildOccasionMain(lang, occKey, occData);
      content = content.replace(/<main id="main">[\s\S]*?<\/main>/i, newMain);

      await writeFile(fullPath, content, "utf8");
      console.log(`Updated: ${tree}/${relPath}`);
    } catch (err) {
      console.error(`Error updating ${tree}/${relPath}:`, err.message);
    }
  }
}

// Also update occasions/index.html (the hub)
async function updateOccasionsHub() {
  const trees = ["public_html"];
  const hubData = {
    en: {
      title: "Occasions Jewellery & Celebrations | eMarket247",
      metaDesc: "Discover handcrafted jewellery for every meaningful moment. From Puja and Eid to Weddings, Anniversaries, and Birthdays, explore eMarket247's curated edits.",
      ogTitle: "Occasions Jewellery & Celebrations | eMarket247",
      ogDesc: "Discover handcrafted jewellery for every meaningful moment. Explore eMarket247's curated edits.",
      links: [
        { name: "Puja", sub: "Autumn devotion & festive celebration", href: "/en/occasions/puja/" },
        { name: "Eid", sub: "Joyous dawn prayers & evening feasts", href: "/en/occasions/eid/" },
        { name: "Wedding", sub: "Ceremonial suites & heirloom vows", href: "/en/occasions/wedding/" },
        { name: "Bridal", sub: "Regal sita hars & majestic suites", href: "/en/occasions/bridal/" },
        { name: "Anniversary", sub: "Milestones & eternal devotion", href: "/en/occasions/anniversary/" },
        { name: "Birthday", sub: "Personal sparkle & celebratory joy", href: "/en/occasions/birthday/" },
        { name: "Gifts", sub: "Tokens of gratitude & affection", href: "/en/occasions/gifts/" }
      ],
      panelH2: "Curated jewellery for life's most cherished chapters.",
      panelP1: "Jewellery holds sentiment beyond mere ornament. At eMarket247, every occasion collection is curated with cultural understanding, clear measurements, and unedited photography.",
      panelP2: "Whether planning ahead for festival deadlines or selecting a surprise anniversary token, our customer concierge is available on WhatsApp to guide your choices with honesty."
    },
    bn: {
      title: "বিশেষ উৎসব ও উপলক্ষের গহনা | eMarket247",
      metaDesc: "জীবনের প্রতিটি স্মরণীয় ক্ষণ রাঙিয়ে তুলতে eMarket247-এর উৎসব ও উপলক্ষ কালেকশন। পূজা, ঈদ, বিয়ে, বার্ষিকী ও জন্মদিনের জন্য বিশেষ গহনা।",
      ogTitle: "বিশেষ উৎসব ও উপলক্ষের গহনা | eMarket247",
      ogDesc: "জীবনের প্রতিটি স্মরণীয় ক্ষণ রাঙিয়ে তুলতে eMarket247-এর উৎসব ও উপলক্ষ কালেকশন।",
      links: [
        { name: "পূজা", sub: "শারদীয় উৎসব ও অঞ্জলির সাজ", href: "/bn/occasions/puja/" },
        { name: "ঈদ", sub: "সকালের স্নিগ্ধতা ও উৎসবের আড্ডা", href: "/bn/occasions/eid/" },
        { name: "বিয়ে", sub: "গায়ে হলুদ থেকে বিবাহোত্তর সংবর্ধনা", href: "/bn/occasions/wedding/" },
        { name: "ব্রাইডাল", sub: "কনের রাজকীয় রূপ ও সীতা হার", href: "/bn/occasions/bridal/" },
        { name: "বার্ষিকী", sub: "ভালোবাসার পথচলার চিরন্তন স্মারক", href: "/bn/occasions/anniversary/" },
        { name: "জন্মদিন", sub: "হাসিমুখের বিশেষ উপহার ও আনন্দ", href: "/bn/occasions/birthday/" },
        { name: "উপহার", sub: "কৃতজ্ঞতা ও ভালোবাসার প্রকাশ", href: "/bn/occasions/gifts/" }
      ],
      panelH2: "জীবনের প্রতিটি স্মরণীয় মুহূর্তের জন্য নিখুঁত গহনা।",
      panelP1: "অলংকার কেবল সাজসজ্জা নয়, প্রতিটি উৎসব ও উদযাপনের সাথে জড়িয়ে থাকে একরাশ আবেগ। eMarket247-এ আমরা প্রতিটি উপলক্ষকে সম্মান জানিয়ে তৈরি করেছি বাস্তবসম্মত ও বিশ্বাসযোগ্য কালেকশন।",
      panelP2: "উৎসবের ভিড় এড়িয়ে নিশ্চিন্তে সঠিক সাইজ ও ডিজাইন নির্বাচন করতে আমাদের হোয়াটসঅ্যাপ পরামর্শ সেবা গ্রহণ করুন।"
    }
  };

  for (const tree of trees) {
    for (const lang of ["en", "bn"]) {
      const relPath = `${lang}/occasions/index.html`;
      const fullPath = path.join(root, tree, relPath);
      try {
        let content = await readFile(fullPath, "utf8");
        const d = hubData[lang];
        const isBn = lang === "bn";

        content = content.replace(/<title>[^<]*<\/title>/i, `<title>${d.title}</title>`);
        content = content.replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${d.metaDesc}">`);
        content = content.replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${d.ogTitle}">`);
        content = content.replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${d.ogDesc}">`);

        const newMain = `<main id="main"><section class="editorial-hero full-width-hero occasion-hero"><img class="hero-bg" src="/assets/images/editorial/occasions_hero_banner.jpg" width="1664" height="2080" alt="${d.ogTitle}" fetchpriority="high"><div class="hero-shade"></div><div class="wrap"><div class="hero-content hero-editorial-col"><p class="eyebrow"><strong class="brand-name">eMarket247</strong> ${isBn ? "উপলক্ষ কালেকশন" : "Occasions Edit"}</p><h1>${isBn ? "জীবনের সব স্মরণীয় মুহূর্তের জন্য।" : "For life's most meaningful moments."}</h1><p>${isBn ? "পূজা, ঈদ, বিয়ে, বার্ষিকী কিংবা প্রিয়জনের জন্মদিন—সব উপলক্ষ উদযাপনে আমাদের বিশেষ ও নির্ভরযোগ্য জুয়েলারি কালেকশন।" : "From the sacred joy of Puja and Eid to wedding vows and anniversaries, discover jewellery created to honor every milestone."}</p><div class="hero-actions"><a class="button hero-btn-primary" href="/${lang}/shop/">${isBn ? "সব কালেকশন দেখুন →" : "Explore Collection →"}</a></div></div></div></section><section class="assurance-strip" aria-label="eMarket247 Assurance"><div class="wrap"><ul><li>${SVG_ICONS.consultation}<div><strong>${isBn ? "সরাসরি সহায়তা" : "Direct Guidance"}</strong><span>${isBn ? "হোয়াটসঅ্যাপে গহনার বিস্তারিত তথ্য ও পরামর্শ নিন: +880 1740-501062।" : "Inquire directly on WhatsApp for piece dimensions and sizing: +880 1740-501062."}</span></div></li><li>${SVG_ICONS.camera}<div><strong>${isBn ? "স্বচ্ছ ফটোগ্রাফি" : "Clear Studio Images"}</strong><span>${isBn ? "কোনো কৃত্রিম ফিল্টার ছাড়াই আসল রূপ দেখুন।" : "View genuine craftsmanship without misleading filters or altered lighting."}</span></div></li><li>${SVG_ICONS.delivery}<div><strong>${isBn ? "দেশজুড়ে ডেলিভারি" : "Pan-Bangladesh Delivery"}</strong><span>${isBn ? "৬৪টি জেলাতেই নিরাপদ ও দ্রুততম ডেলিভারি।" : "Safe, trackable delivery across all 64 districts in Bangladesh."}</span></div></li><li>${SVG_ICONS.shield}<div><strong>${isBn ? "১৫ দিনের প্রতিশ্রুতি" : "15-Day Promise"}</strong><span>${isBn ? "সহজ রিটার্ন ও স্বচ্ছ পলিসির নিশ্চয়তা।" : "Honest terms and a customer-first refund commitment."}</span></div></li></ul></div></section><section class="occasion-detail wrap"><div><p class="eyebrow">${isBn ? "উপলক্ষ নির্বাচন করুন" : "Meaningful moments"}</p><h2>${isBn ? "উপলক্ষ অনুযায়ী গহনা খুঁজুন।" : "Discover by occasion."}</h2><p style="color:var(--muted);font-size:14px;line-height:1.6;margin-top:14px;">${isBn ? "প্রতিটি বিশেষ উৎসব ও সামাজিক উদযাপনের জন্য সুনির্দিষ্ট ও নান্দনিক কালেকশন।" : "Explore handcrafted jewellery curated for every cultural celebration and personal milestone."}</p></div><div class="occasion-links">${d.links.map(l => `<a href="${l.href}"><span>${l.name} <small style="color:var(--muted);font-size:11px;display:block;">${l.sub}</small></span><b>→</b></a>`).join("")}</div></section><section class="two-panel wrap"><figure><img src="/assets/images/editorial/emarket247-bridal-occasion-editorial.webp" width="1664" height="2080" loading="lazy" alt="eMarket247 Editorial Reference"><figcaption>eMarket247 Occasions Reference</figcaption></figure><div><p class="eyebrow">${isBn ? "উপলক্ষের পরিকল্পনা" : "Occasion Curation"}</p><h2>${d.panelH2}</h2><p>${d.panelP1}</p><p>${d.panelP2}</p><a class="button button-dark" href="https://wa.me/8801740501062?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20eMarket247%20Occasions" target="_blank" rel="noopener">${isBn ? "হোয়াটসঅ্যাপে যোগাযোগ করুন ↗" : "Inquire on WhatsApp ↗"}</a></div></section><section class="trust-grid wrap"><div><p class="eyebrow">${isBn ? "কেন eMarket247" : "The eMarket247 Standard"}</p><h2>${isBn ? "তথ্য দিয়ে শুরু করি, প্রতিশ্রুতি দিয়ে নয়।" : "Founded on facts, not speculative promises."}</h2></div><ol><li><b>${isBn ? "০১" : "01"}</b><div><strong>${isBn ? "ফটোগ্রাফি ও স্বচ্ছতা" : "Photographic Integrity"}</strong><p>${isBn ? "স্টুডিওতে তোলা বাস্তব ছবি পণ্যের আসল রঙ ও ফিনিশিং তুলে ধরে।" : "Unfiltered studio captures represent color tone, gemstone texture, and dimensional balance."}</p></div></li><li><b>${isBn ? "০২" : "02"}</b><div><strong>${isBn ? "সঠিক তথ্যের নিশ্চয়তা" : "Informed Decisions"}</strong><p>${isBn ? "সঠিক পরিমাপ ও যত্ন সহায়িকা দেখে নিশ্চিন্তে সিদ্ধান্ত নিন।" : "Care guidance and clear dimensions allow you to select pieces suited to your wardrobe."}</p></div></li><li><b>${isBn ? "০৩" : "03"}</b><div><strong>${isBn ? "উভয় ভাষায় সেবার ব্যবস্থা" : "Bilingual Assistance"}</strong><p>${isBn ? "বাংলা ও ইংরেজি উভয় ভাষায় সম্পূর্ণ ক্যাটালগ ও সেবা প্রস্তুত।" : "Full catalog exploration and direct customer consultation in both English and Bengali."}</p></div></li></ol></section></main>`;

        content = content.replace(/<main id="main">[\s\S]*?<\/main>/i, newMain);
        await writeFile(fullPath, content, "utf8");
        console.log(`Updated Hub: ${tree}/${relPath}`);
      } catch (err) {
        console.error(`Error updating Hub ${tree}/${relPath}:`, err.message);
      }
    }
  }
}

async function main() {
  const targets = [
    { relPath: "en/occasions/wedding/index.html", lang: "en", occKey: "wedding" },
    { relPath: "bn/occasions/wedding/index.html", lang: "bn", occKey: "wedding" },
    { relPath: "en/occasions/bridal/index.html", lang: "en", occKey: "bridal" },
    { relPath: "bn/occasions/bridal/index.html", lang: "bn", occKey: "bridal" },
    { relPath: "en/occasions/eid/index.html", lang: "en", occKey: "eid" },
    { relPath: "bn/occasions/eid/index.html", lang: "bn", occKey: "eid" },
    { relPath: "en/occasions/anniversary/index.html", lang: "en", occKey: "anniversary" },
    { relPath: "bn/occasions/anniversary/index.html", lang: "bn", occKey: "anniversary" },
    { relPath: "en/occasions/birthday/index.html", lang: "en", occKey: "birthday" },
    { relPath: "bn/occasions/birthday/index.html", lang: "bn", occKey: "birthday" },
    { relPath: "en/occasions/gifts/index.html", lang: "en", occKey: "gifts" },
    { relPath: "bn/occasions/gifts/index.html", lang: "bn", occKey: "gifts" },
  ];

  for (const t of targets) {
    await updateOccasionPage(t.relPath, t.lang, t.occKey);
  }

  await updateOccasionsHub();
  console.log("All occasion pages updated successfully!");
}

main().catch(console.error);
