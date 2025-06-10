import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Bem-vindo ao nosso sistema
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Um portal completo para clientes e administradores, com acesso seguro e
          prático.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium shadow hover:bg-blue-700 transition">
              Login
            </button>
          </Link>
          <Link to="/register" style={{ marginLeft: 8 }}>
            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-base font-medium shadow hover:bg-gray-300 transition">
              Registrar
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}