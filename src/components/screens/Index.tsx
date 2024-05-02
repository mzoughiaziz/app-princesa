import { React , useRef, useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import { SignOutButton } from '~/components/domain/auth/SignOutButton';
import { Head } from '~/components/shared/Head';
import { useFirestore, useStorage } from "~/lib/firebase";
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import ProductCard from "../shared/ProductCard";

import 'react-toastify/dist/ReactToastify.css';

export type Product = {
  id: string,
  name: string,
  details: string,
  image: string,
  price: string,
  category: string,
}

export enum InputEnum {
  Id = 'id',
  Name = 'name',
  Details = 'details',
  Image = 'image',
  Price = 'price',
  Category = 'category'
}


function Index() {
  const { state } = useAuthState();
  const [products, setProducts] = useState<Array<Product>>([]);
  const firestore = useFirestore();
  const storage = useStorage();
  const [inputData, setInputData] = useState<Partial<Product>>({
    name: '',
    details: '',
    image: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState("");
  const [formError, setFormError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const productsCollection = collection(firestore, "products");
      const productsQuery = query(productsCollection);
      const querySnapshot = await getDocs(productsQuery);
      const fetchedData: Array<Product> = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data()} as Product);
      })
      setProducts(fetchedData);
    }
    fetchData();
  }, []);

  const onUpdateProduct =  (id: string, data: Partial<Product>) => {
    const docRef = doc(firestore, "products", id);

     updateDoc(docRef, data)
      .then(docRef => {
        toast.success('Produto atualizado com successo!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value})
  }

  const handleImgChange = (e: React.FormEvent<HTMLFormElement>) => {
    setImage(e.target.files[0]);
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const productsCollection = collection(firestore, "products");

      const newProduct: Partial<Product> = {
        name: inputData.name,
        details: inputData.details,
        image: inputData.image,
        price: inputData.price,
        category: inputData.category,
      }

      const docRef = await addDoc(productsCollection, newProduct);

      toast.success('Produto adicionado com successo!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      setProducts([...products,{ id: docRef.id, ...newProduct}]);
      setInputData({
        name: '',
        details: '',
        image: '',
        price: '',
        category: ''
      })
    } catch(error) {
      setFormError(true);
    }
  }

  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  <form className="flex items-center" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">  <input
                type="text"
                onChange={(e) => handleInputChange(InputEnum.Name, e.target.value)}
                value={inputData.name}
                placeholder="Nome do produto"
                className="m-2 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
              />
              <input
                type="text"
                onChange={(e) => handleInputChange(InputEnum.Details, e.target.value)}
                value={inputData.details}
                placeholder="Detalhes"
                className="m-2 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
              />
              <input
                type="text"
                onChange={(e) => handleInputChange(InputEnum.Image, e.target.value)}
                value={inputData.image}
                placeholder="Imagem"
                className="m-2 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
              />
              <input
                type="text"
                onChange={(e) => handleInputChange(InputEnum.Category, e.target.value)}
                value={inputData.category}
                placeholder="Categoria"
                className="m-2 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
              />
              <input
                type="text"
                onChange={(e) => handleInputChange(InputEnum.Price, e.target.value)}
                value={inputData.price}
                placeholder="Preço"
                className="m-2 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="m-4 border border-purple-500 p-3 rounded-lg transition-opacity bg-purple-600 bg-opacity-30 hover:bg-opacity-50 text-slate-50"
            >
              Adicionar Produto
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full bg-transparent text-slate-50">
              {
                products.map((tool) => (
                  <ProductCard key={tool.id} tool={tool} onUpdate={onUpdateProduct} />
                ))
              }
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Index;
