# Jewelry Product Management & Customer Chat Web Application

Web Application สำหรับนำเสนอสินค้าและข้อมูลร้านเครื่องประดับ พร้อมระบบ **Real-time Chat** สำหรับให้ลูกค้าติดต่อกับร้านค้าโดยตรง

พัฒนาเป็น **University Project** โดยพัฒนาด้วยตนเองตั้งแต่ Frontend, Backend, Database ไปจนถึงระบบจัดการสำหรับ Admin

---

## Overview

ระบบแบ่งออกเป็นส่วนของลูกค้าและระบบจัดการร้านค้า

### Customer

* ดูข้อมูลและรายละเอียดของร้านเครื่องประดับ
* ดูรายการสินค้าและรายละเอียดสินค้า
* ดูสินค้าแยกตาม Category
* ติดต่อร้านค้าผ่าน **Real-time Chat**
* สมัครสมาชิก / Login

ระบบ Chat รองรับการสนทนาแบบ **1-on-1** ระหว่างลูกค้าและ Admin และ Admin สามารถดูแลหลาย Chat พร้อมกันได้

---

## Admin Dashboard

Admin สามารถจัดการข้อมูลของร้านและสินค้า รวมถึงติดตามกิจกรรมภายในระบบ

* เพิ่ม / แก้ไข / ลบสินค้า
* จัดการ Product Categories
* จัดการข้อมูลภายในระบบ
* ดูและตอบ Customer Chat
* ดู User Activity ผ่าน Dashboard

### Role-Based Access Control

| Role            | Access                                 |
| --------------- | -------------------------------------- |
| **Super Admin** | จัดการ Account และเข้าถึงระบบทั้งหมด   |
| **Admin**       | จัดการสินค้าและฟังก์ชันที่ได้รับอนุญาต |

---

## Real-time Chat

ระบบ Chat พัฒนาด้วย **WebSocket** เพื่อให้ข้อความสามารถส่งและแสดงผลแบบ Real-time โดยไม่ต้อง Refresh หน้าเว็บ

```text
Customer ──────── WebSocket ──────── Admin
    │                                  │
    └────────── Real-time Chat ────────┘
```

Admin สามารถเปิดและจัดการการสนทนากับลูกค้าหลายคนได้จากระบบเดียว

---

## Tech Stack

* **React + Vite** — Frontend
* **Node.js** — Backend
* **WebSocket** — Real-time Communication
* **MongoDB** — Database
* **MongoDB Atlas** — Cloud Database
* **Render** — Backend Deployment
* **GitHub Pages** — Frontend Deployment

---

## Project Structure

```text
Frontend/
├── components/
├── pages/
├── ...
    
Backend/
├── controllers/
├── models/
├── routes/
├── ...
```

---

## Deployment

**Frontend:** GitHub Pages
**Backend:** Render
**Database:** MongoDB Atlas

---

## Project Information

**ประเภท:** University Project
**รูปแบบ:** Full-stack Web Application
**พัฒนา:** Developed Independently

โปรเจคนี้จัดทำขึ้นเพื่อฝึกการพัฒนา Web Application ที่มีทั้งระบบจัดการข้อมูล, Authentication, Role-Based Access Control, Cloud Database และ Real-time Communication ผ่าน WebSocket
