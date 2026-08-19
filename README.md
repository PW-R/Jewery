# Jewelry Product Management & Customer Chat Web Application

Web Application สำหรับร้านเครื่องประดับที่รวมระบบแสดงสินค้า ข้อมูลร้านค้า และระบบ **Real-time Customer Chat** ไว้ในเว็บไซต์เดียว

พัฒนาเป็น **University Project** โดยพัฒนาด้วยตนเองทั้ง Frontend, Backend, Database และระบบจัดการสำหรับ Admin

---

## Overview

เว็บไซต์ถูกออกแบบให้เป็นช่องทางสำหรับลูกค้าในการดูข้อมูลร้านและสินค้า พร้อมสามารถติดต่อร้านค้าได้โดยตรงผ่านระบบ Chat

### Customer Features

* สมัครสมาชิก / Login
* ดูข้อมูลและรายละเอียดของร้าน
* ดูรายการสินค้าเครื่องประดับ
* ดูรายละเอียดสินค้า
* เลือกดูสินค้าตาม **Category**
* ติดต่อร้านค้าผ่านระบบ **Real-time Chat**

ระบบ Chat เป็นการสื่อสารแบบ **1-on-1** ระหว่างลูกค้าและ Admin โดยใช้ WebSocket เพื่อให้ข้อความส่งถึงกันแบบ Real-time โดยไม่ต้อง Refresh หน้าเว็บ

---

## Admin System

ระบบ Admin ใช้สำหรับจัดการข้อมูลสินค้าและดูแลการติดต่อกับลูกค้า

### Product Management

Admin สามารถ:

* เพิ่มสินค้า
* แก้ไขข้อมูลสินค้า
* ลบสินค้า
* จัดการ Product Category
* จัดการรายละเอียดและข้อมูลของสินค้า

### Customer Chat

Admin สามารถดูและตอบ Chat จากลูกค้าแต่ละคนได้ โดยรองรับการเปิดดู **หลาย Conversation** ภายในระบบเดียว

### Dashboard

Admin Dashboard แสดงข้อมูลที่ช่วยติดตามการใช้งานเว็บไซต์ เช่น

* User Activity
* จำนวนผู้ใช้งาน
* กิจกรรมภายในระบบ
* ข้อมูลสินค้า

---

## Role-Based Access Control

ระบบมีการกำหนดสิทธิ์ตาม Role เพื่อควบคุมการเข้าถึงฟังก์ชันต่าง ๆ

| Role            | Access                                        |
| --------------- | --------------------------------------------- |
| **Super Admin** | จัดการ Account และเข้าถึงฟังก์ชันทั้งหมด      |
| **Admin**       | จัดการสินค้า, Chat และฟังก์ชันที่ได้รับอนุญาต |

---

## Real-time Chat

ระบบ Chat พัฒนาด้วย **WebSocket** ทำให้สามารถส่งข้อมูลระหว่าง Client และ Server ได้แบบ Real-time

```text
Customer
    │
    │ WebSocket
    ▼
 Backend Server
    │
    │ WebSocket
    ▼
   Admin
```

Admin หนึ่งคนสามารถดูแลและตอบกลับ Conversation จากลูกค้าหลายคนได้

---

## Tech Stack

### Frontend

* **React** — UI Development
* **Vite** — Development & Build Tool
* **Tailwind CSS** — Styling

### Backend

* **Node.js** — Backend Server
* **WebSocket** — Real-time Communication

### Database

* **MongoDB** — Application Database
* **MongoDB Atlas** — Cloud Database

### Deployment

* **GitHub Pages** — Frontend
* **Render** — Backend

---

## Architecture

```text
┌─────────────────────┐
│     GitHub Pages    │
│   React + Vite      │
│    Tailwind CSS     │
└──────────┬──────────┘
           │
           │ API / WebSocket
           ▼
┌─────────────────────┐
│       Render        │
│    Node.js Backend  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    MongoDB Atlas     │
│      Database        │
└─────────────────────┘
```

---

## Project Structure

```text
Frontend/
├── public/
├── src/
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js

Backend/
├── controllers/
├── models/
├── routes/
└── ...
```

---

## Getting Started

### Frontend

```bash
git clone <repository-url>
cd <frontend-folder>
npm install
npm run dev
```

### Backend

```bash
cd <backend-folder>
npm install
npm run dev
```

> ต้องตั้งค่า Environment Variables สำหรับ Backend และ MongoDB Atlas ก่อนเริ่มใช้งาน

---

## Project Information

**ประเภท:** University Project
**รูปแบบ:** Full-stack Web Application
**พัฒนา:** Developed Independently

โปรเจคนี้จัดทำขึ้นเพื่อฝึกการพัฒนา Full-stack Application ที่มีทั้ง **Authentication, CRUD, Role-Based Access Control, Cloud Database และ Real-time Communication** โดยใช้ WebSocket สำหรับระบบ Chat ระหว่างลูกค้าและร้านค้า
