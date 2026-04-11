export type Book = {
  id: string;
  title: string;
  isbn: string;
  author: string;
  sellerEmail: string;
  price: number;
  description: string;
  coverUrl: string;
  sellerId: string;
  status: "available" | "sold";
};

export type Order = {
  id: string;
  bookId: string;
  userId: string;
  orderedAt: string;
  status: "active" | "cancelled";
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};
