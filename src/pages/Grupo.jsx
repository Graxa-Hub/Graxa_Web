// import React, { useState } from "react";
// import axios from "axios";
// import { RootLayout } from "../components/Dashboard/RootLayout";
// import BgImg from "/cadastro-bg2.png";
// import { Navbar } from "../components/Dashboard/Navbar";
// import { SecondaryNav } from "../components/Dashboard/SecondaryNav";
// import { Content } from "../components/Dashboard/Content";

// export const Grupo = () => {
//   const [grupo, setGrupo] = useState({
//     nome: "",
//     manager: "",
//     emailManager: "",
//     telefoneManager: "",
//     integrantes: [{ nome: "", cargo: "", email: "", telefone: "" }],
//   });

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setGrupo({ ...grupo, [name]: value });
//   }

//   function handleIntegranteChange(index, e) {
//     const { name, value } = e.target;
//     const novosIntegrantes = [...grupo.integrantes];
//     novosIntegrantes[index][name] = value;
//     setGrupo({ ...grupo, integrantes: novosIntegrantes });
//   }

//   function adicionarIntegrante() {
//     setGrupo({
//       ...grupo,
//       integrantes: [
//         ...grupo.integrantes,
//         { nome: "", cargo: "", email: "", telefone: "" },
//       ],
//     });
//   }

//   async function registrarGrupo() {
//     if (!grupo.nome || !grupo.manager) {
//       alert("Preencha os campos obrigatórios!");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:3000/grupos", grupo);
//       alert("Grupo registrado com sucesso!");
//       setGrupo({
//         nome: "",
//         manager: "",
//         emailManager: "",
//         telefoneManager: "",
//         integrantes: [{ nome: "", cargo: "", email: "", telefone: "" }],
//       });
//     } catch (err) {
//       console.error("Erro ao registrar grupo:", err);
//       alert("Erro ao registrar grupo.");
//     }
//   }

//   return (
//     <RootLayout>
//       {/* Background Image */}
//       <img
//         className="img w-full h-full object-cover object-center absolute top-0 left-0"
//         src={BgImg}
//         alt="Background Image"
//       />

//       {/* Bg Overlay */}
//       <div className="w-full h-full absolute top-0 left-0 bg-gradient to-tr from-neutral-950/40 to-neutral-950/40"></div>

//       {/* Layout Section */}
//       <div className="w-full flex items-center gap-7 flex-wrap z-50">
//         {/* Navbar */}
//         <Navbar />

//         {/* Dashboard */}
//         <Content>
//           <SecondaryNav />

//           {/* CODAR A PARTIR DAQUI VVVVVVV */}
//           <div className="bg-white/90 p-8 rounded-2xl shadow-md w-full max-w-5xl mt-4">
//             <h1 className="text-2xl font-bold mb-6 text-gray-800">
//               Cadastro de Grupo
//             </h1>

//             {/* Campos principais */}
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <div>
//                 <label className="block font-semibold text-gray-700 mb-1">
//                   Nome do Grupo:
//                 </label>
//                 <input
//                   type="text"
//                   name="nome"
//                   value={grupo.nome}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg p-2 bg-gray-100"
//                 />
//               </div>

//               <div>
//                 <label className="block font-semibold text-gray-700 mb-1">
//                   Gerente / Manager:
//                 </label>
//                 <input
//                   type="text"
//                   name="manager"
//                   value={grupo.manager}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg p-2 bg-gray-100"
//                 />
//               </div>

//               <div>
//                 <label className="block font-semibold text-gray-700 mb-1">
//                   Email do Manager:
//                 </label>
//                 <input
//                   type="email"
//                   name="emailManager"
//                   value={grupo.emailManager}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg p-2 bg-gray-100"
//                 />
//               </div>

//               <div>
//                 <label className="block font-semibold text-gray-700 mb-1">
//                   Telefone do Manager:
//                 </label>
//                 <input
//                   type="text"
//                   name="telefoneManager"
//                   value={grupo.telefoneManager}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg p-2 bg-gray-100"
//                 />
//               </div>
//             </div>

//             <h2 className="text-lg font-semibold mb-2">Integrantes:</h2>
//             <hr className="mb-4" />

//             {grupo.integrantes.map((integrante, index) => (
//               <div
//                 key={index}
//                 className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-lg"
//               >
//                 <div>
//                   <label className="block font-semibold text-gray-700 mb-1">
//                     Nome do Integrante:
//                   </label>
//                   <input
//                     type="text"
//                     name="nome"
//                     value={integrante.nome}
//                     onChange={(e) => handleIntegranteChange(index, e)}
//                     className="w-full border rounded-lg p-2 bg-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-700 mb-1">
//                     Cargo:
//                   </label>
//                   <input
//                     type="text"
//                     name="cargo"
//                     value={integrante.cargo}
//                     onChange={(e) => handleIntegranteChange(index, e)}
//                     className="w-full border rounded-lg p-2 bg-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-700 mb-1">
//                     Email:
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={integrante.email}
//                     onChange={(e) => handleIntegranteChange(index, e)}
//                     className="w-full border rounded-lg p-2 bg-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-700 mb-1">
//                     Telefone:
//                   </label>
//                   <input
//                     type="text"
//                     name="telefone"
//                     value={integrante.telefone}
//                     onChange={(e) => handleIntegranteChange(index, e)}
//                     className="w-full border rounded-lg p-2 bg-white"
//                   />
//                 </div>
//               </div>
//             ))}

//             <div className="flex items-center justify-between">
//               <button
//                 onClick={adicionarIntegrante}
//                 className="border-2 border-gray-400 rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-200 transition"
//               >
//                 +
//               </button>

//               <button
//                 onClick={registrarGrupo}
//                 className="bg-gray-800 text-white font-semibold py-2 px-8 rounded-xl hover:bg-gray-700 transition"
//               >
//                 Registrar
//               </button>
//             </div>
//           </div>
//         </Content>
//       </div>
//     </RootLayout>
//   );
// };
