#!/usr/bin/env python3
"""fix-pdp-faq-v2.py — Replace FAQ accordion placeholder in all PDPs."""
import os
import re

ROOT = r"F:\EMARKET247\Project 011\emarket247-shop-main\public_html"

# EN PDP: old content to remove from the FAQ accordion
EN_OLD = '<p>Our customer care team is here to assist you.</p>'
# EN PDP: replacement (inside the accordion div)
EN_NEW = (
    '<p><strong>Is this real gold?</strong> No — this is gold-tone (imitation) jewellery, '
    'not solid gold. We always state the material honestly.</p>'
    '<p><strong>Will the colour fade?</strong> With proper care — removing before water, '
    'perfume, and sweat — the colour typically lasts 6–12 months or longer.</p>'
    '<p><strong>How do I get the exact price?</strong> Message us on WhatsApp with the '
    'product reference. We confirm price and availability within hours.</p>'
    '<p><strong>Can I return it?</strong> Yes — within 15 days of delivery, unused and in '
    'original condition. Contact us on WhatsApp to start a return.</p>'
)

# BN PDP: old content
BN_OLD = '<p>আমাদের কাস্টমার কেয়ার টিম আপনাকে সব ধরণের সহায়তা করবে।</p>'
# BN PDP: replacement
BN_NEW = (
    '<p><strong>এটা কি আসল সোনা?</strong> না — এটি সোনালি রঙের (ইমিটেশন) গহনা, '
    'বিশুদ্ধ সোনা নয়। আমরা সবসময় উপাদান সম্পর্কে সৎ থাকি।</p>'
    '<p><strong>রঙ কি উঠে যাবে?</strong> সঠিক যত্ন নিলে — পানি, প্রসাধন ও ঘাম থেকে আগে '
    'খুলে রাখলে — রঙ সাধারণত ৬–১২ মাস বা তার বেশি সময় থাকে।</p>'
    '<p><strong>সঠিক মূল্য কীভাবে জানব?</strong> পণ্যের রেফারেন্স দিয়ে WhatsApp-এ '
    'মেসেজ করুন। আমরা কয়েক ঘণ্টার মধ্যে মূল্য ও প্রাপ্যতা নিশ্চিত করব।</p>'
    '<p><strong>ফেরত দিতে পারব?</strong> হ্যাঁ — ডেলিভারির ১৫ দিনের মধ্যে, '
    'অব্যবহৃত ও আসল অবস্থায় থাকলে। রিটার্ন শুরু করতে WhatsApp-এ যোগাযোগ করুন।</p>'
)

changed_en = 0
changed_bn = 0
skipped = 0

for lang in ('en', 'bn'):
    products_dir = os.path.join(ROOT, lang, 'products')
    if not os.path.isdir(products_dir):
        continue
    for entry in os.scandir(products_dir):
        if not entry.is_dir():
            continue
        html_path = os.path.join(entry.path, 'index.html')
        try:
            with open(html_path, 'r', encoding='utf-8', newline='') as fh:
                html = fh.read()
        except Exception:
            continue

        old = EN_OLD if lang == 'en' else BN_OLD
        new = EN_NEW if lang == 'en' else BN_NEW

        if old in html:
            html = html.replace(old, new, 1)
            with open(html_path, 'w', encoding='utf-8', newline='') as fh:
                fh.write(html)
            if lang == 'en':
                changed_en += 1
                print(f'  ✓ {lang}/products/{entry.name}/ — EN FAQ replaced')
            else:
                changed_bn += 1
                print(f'  ✓ {lang}/products/{entry.name}/ — BN FAQ replaced')
        elif 'id="pdp-faq"' in html:
            skipped += 1
        else:
            skipped += 1

print(f'\nDone. EN: {changed_en} replaced, BN: {changed_bn} replaced, {skipped} skipped.')
