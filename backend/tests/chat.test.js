import { expect } from "chai";
import supertest from "supertest";
import app, { initDB } from "../app.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

const request = supertest(app);

let customer, admin, chatId;

describe("Chat API Tests", function () {
  this.timeout(10000); 

  before(async () => {

  await initDB();

  // ล้างข้อมูลก่อนทดสอบ
  await Chat.deleteMany({});
  await User.deleteMany({ email: /testuser/ });

  // ✅ สร้างผู้ใช้จำลอง (ลูกค้า)
  customer = await User.create({
    title: "Mr.",
    firstName: "Test",
    lastName: "Customer",
    age: 25,
    email: "testuser_customer@example.com",
    password: "Customer1234",
    phone: "0800000000",
    role: "user", // ✅ ตรงกับ enum ในโมเดล
  });

  // ✅ สร้างผู้ใช้จำลอง (แอดมิน)
  admin = await User.create({
    title: "Mr.",
    firstName: "Test",
    lastName: "Admin",
    age: 30,
    email: "testuser_admin@example.com",
    password: "Admin1234",
    phone: "0801111111",
    role: "admin",
  });
});

  after(async () => {
    await Chat.deleteMany({});
    await User.deleteMany({ email: /testuser/ });
  });

  // 1ลูกค้าส่งข้อความ
  it("POST /api/chats/send ลูกค้าส่งข้อความครั้งแรก", async () => {
    const res = await request.post("/api/chats/send").send({
      customerId: customer._id,
      message: "สวัสดีครับ แอดมินอยู่ไหม?",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("chat");
    expect(res.body.chat.messages[0].sender).to.equal("customer");
    expect(res.body.chat.messages[0].text).to.include("สวัสดี");

    chatId = res.body.chat._id; // เก็บไว้ใช้ในเทสต์ถัดไป
  });

  // 2แอดมินตอบกลับ
  it("POST /api/chats/reply แอดมินตอบข้อความลูกค้า", async () => {
    const res = await request.post("/api/chats/reply").send({
      chatId,
      adminId: admin._id,
      message: "สวัสดีครับ ",
    });

    expect(res.status).to.equal(200);
    expect(res.body.chat.messages.some(m => m.sender === "admin")).to.be.true;
  });

  // 3ดึงแชทของลูกค้าคนเดียว
  it("GET /api/chats/customer/:customerIdดึงแชทของลูกค้าคนเดียว", async () => {
    const res = await request.get(`/api/chats/customer/${customer._id}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id", chatId);
    expect(res.body.messages).to.be.an("array");
  });

  // 4ดึงแชทของแอดมิน
  it("GET /api/chats/admin/:adminId ดึงแชททั้งหมดของแอดมิน", async () => {
    const res = await request.get(`/api/chats/admin/${admin._id}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body[0]).to.have.property("adminId");
  });

  // 5 แอดมินรับแชท
  it("PUT /api/chats/accept/:chatId แอดมินรับแชท", async () => {
    await Chat.findByIdAndUpdate(chatId, { isAssigned: false, adminId: null });
    const res = await request
      .put(`/api/chats/accept/${chatId}`)
      .send({ adminId: admin._id });

    expect(res.status).to.equal(200);
    expect(res.body.chat.isAssigned).to.be.true;
    expect(res.body.chat.adminId).to.equal(String(admin._id));
  });

  // 6ป้องกันแอดมินรับซ้ำ
  it("PUT /api/chats/accept/:chatId ป้องกันแอดมินอื่นรับแชทซ้ำ", async () => {
    const res = await request
      .put(`/api/chats/accept/${chatId}`)
      .send({ adminId: "666666666666666666666666" }); // fake id

    expect(res.status).to.equal(400);
    expect(res.body.message).to.include("already assigned");
  });

  // 7ดึงแชททั้งหมด (superadmin)
  it("GET /api/chats → แอดมินดูแชททั้งหมด", async () => {
    const res = await request.get("/api/chats");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});
