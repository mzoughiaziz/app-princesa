import React, { useRef, useState, useEffect } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import { Head } from '~/components/shared/Head';
import { useFirestore, useStorage } from '~/lib/firebase';
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import ProductCard from '../shared/ProductCard';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 } from 'uuid';

import 'react-toastify/dist/ReactToastify.css';

export type Product = {
  id: string;
  name: string;
  details: string;
  image: string;
  price: string;
  category: string;
  removed: boolean;
};

export enum InputEnum {
  Id = 'id',
  Name = 'name',
  Details = 'details',
  Image = 'image',
  Price = 'price',
  Category = 'category',
}

function MainPage() {
  const [products, setProducts] = useState<any>([]);
  const firestore = useFirestore();
  const storage = useStorage();
  const [inputData, setInputData] = useState<Partial<Product>>({
    name: '',
    details: '',
    price: '',
    category: '',
  });
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const imagesListRef = ref(storage, "images/");

  let categoriesList = ['colares-pingentes', 'aneis', 'brincos', 'alianca-noivado', 'pulseira', 'alianca-namoro'];

  const [formError, setFormError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const productsCollection = collection(firestore, 'products');
      const productsQuery = query(productsCollection);
      const querySnapshot = await getDocs(productsQuery);
      const fetchedData: Array<Product> = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(fetchedData);
    }
    fetchData();
  }, []);

  const onUpdateProduct = (id: string, data: Partial<Product>) => {
    const docRef = doc(firestore, 'products', id);

    updateDoc(docRef, data)
      .then((docRef) => {
        toast.success('Produto atualizado com successo!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    let imgUrl;
    e.preventDefault();

    try {
      if (imageUpload == null) {
        toast.error('Nenhum imagem do produto foi escolhido!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        return;
      };

      const imageRef = ref(storage, `images/${imageUpload?.name + v4()}`);
      const snapshot = await uploadBytes(imageRef, imageUpload);
      imgUrl = await getDownloadURL(snapshot.ref);
      const productsCollection = collection(firestore, 'products');

      const newProduct: Partial<Product> = {
        name: inputData.name,
        details: inputData.details,
        image: imgUrl,
        price: inputData.price,
        category: inputData.category,
        removed: false
      };

      const docRef = await addDoc(productsCollection, newProduct);

      toast.success('Produto adicionado com successo!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      setProducts([...products, { id: docRef.id, ...newProduct }]);
      setInputData({
        name: '',
        details: '',
        image: '',
        price: '',
        category: '',
      });
    } catch (error) {
      setFormError(true);
    }
  };

  return (
    <>
      <Head title="" />
      <div className="hero max-w-md mx-auto shadow-md md:max-w-2xl bg-slate-800">
        <div className="md:flex">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-amber-100 px-3 grid">
                  Nome do produto
                  <input
                    type="text"
                    onChange={(e) => handleInputChange(InputEnum.Name, e.target.value)}
                    value={inputData.name}
                    placeholder="Exemplo: Anel formatura ouro 18k"
                    className="my-2 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
                    required
                  />
                </div>
                <div className="text-amber-100 px-3 grid">
                  Detalhes do produto
                  <input
                    type="text"
                    onChange={(e) => handleInputChange(InputEnum.Details, e.target.value)}
                    value={inputData.details}
                    placeholder="Exemplo: 1.85 grama Pedra zirconia"
                    className="my-2 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
                    required
                  />
                </div>
                <div className="text-amber-100 px-3 grid ">
                  Imagem do produto
                  <div className="grid">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        setImageUpload(event.target.files[0]);
                      }}
                    />
                  </div>
                </div>
                <div className="text-amber-100 grid px-3">
                  Categoria do produto
                  <select
                    value={inputData.category}
                    onChange={(e) => handleInputChange(InputEnum.Category, e.target.value)}
                    className="my-2 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
                  >
                    <option value="" className="option text-slate-700">
                      Selecione uma categoria
                    </option>
                    {categoriesList.map((category) => (
                      <option key={category} value={category} className="option text-slate-900">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-amber-100 px-3 grid">
                  Preço do produto
                  <input
                    type="text"
                    onChange={(e) => handleInputChange(InputEnum.Price, e.target.value)}
                    value={inputData.price}
                    placeholder="Exemplo: R$ 1219.00"
                    className="my-2 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="m-4 border border-amber-300 p-3 rounded-lg transition-opacity bg-amber-300 bg-opacity-30 hover:bg-opacity-50 text-slate-50"
              >
                Adicionar Produto
              </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full bg-transparent text-slate-50">
              {products.filter((tool) => !tool.removed).map((tool) => (
                <ProductCard key={tool.id} tool={tool} onUpdate={onUpdateProduct} />
              ))}
              {products.filter((tool) => tool.removed).map((tool) => (
                <ProductCard key={tool.id} tool={tool} onUpdate={onUpdateProduct} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default MainPage;