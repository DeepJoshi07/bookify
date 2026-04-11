import type { Book } from "@/types";

const demoSellerId = "user-demo-1";

export const seedBooks: Book[] = [
  {
    id: "b1",
    title: "The Design of Everyday Things",
    isbn: "9780465050659",
    author: "Don Norman",
    sellerEmail: "alex@example.com",
    price: 18.99,
    description:
      "A classic on usability and human-centered design. Essential for anyone building products people use.",
    coverUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    sellerId: demoSellerId,
    status: "available",
  },
  {
    id: "b2",
    title: "Project Hail Mary",
    isbn: "9780593135204",
    author: "Andy Weir",
    sellerEmail: "sam@example.com",
    price: 14.5,
    description:
      "A lone astronaut races to save Earth in this thrilling science fiction adventure.",
    coverUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    sellerId: "user-other",
    status: "available",
  },
  {
    id: "b3",
    title: "Atomic Habits",
    isbn: "9780735211292",
    author: "James Clear",
    sellerEmail: "jordan@example.com",
    price: 21.0,
    description:
      "Tiny changes, remarkable results — a practical guide to building good habits.",
    coverUrl:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
    sellerId: "user-other",
    status: "available",
  },
  {
    id: "b4",
    title: "Dune",
    isbn: "9780441172719",
    author: "Frank Herbert",
    sellerEmail: "taylor@example.com",
    price: 12.99,
    description:
      "Epic science fiction set on the desert planet Arrakis. A masterpiece of world-building.",
    coverUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    sellerId: "user-other",
    status: "sold",
  },
];
