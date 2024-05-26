import { useState } from "react";
import { Product, InputEnum } from "../screens/MainPage";
import { PencilSquareIcon, CheckIcon, XCircleIcon, TrashIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ProductCardProps {
    tool: Product,
    onUpdate: any
}


const ProductCard = ({ tool, onUpdate }: ProductCardProps) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [inputData, setInputData] = useState<Partial<Product>>(tool);

    const toggleIsEdit = () => setIsEdit(prevIsEdit => !prevIsEdit);

    const onClose = () => {
        setIsEdit(false);
        setInputData(tool);
    }

    const handleDelete = () => {
      tool.removed = true;
      setIsEdit(false);
      onUpdate(tool.id, inputData);
    }
    
    const handleRestore = () => {
      tool.removed = false;
      setIsEdit(false);
      onUpdate(tool.id, inputData);
    }

    const handleInputChange = (field: InputEnum, value: string) => {
      setInputData({ ...inputData, [field]: value})
    }

    const handleUpdate = () => {
      setIsEdit(false);
      onUpdate(tool.id, inputData);
    }

    const inputClasses = clsx(
        'bg-transparent',
        'border-0',
        'py-2',
        'px-4',
        'rounded-md'
    )

    return (
       <div key={tool.id} className="group relative rounded-md flex flex-col justify-between shadow-slate-900 shadow-md p-4 bg-gradient-to-r from-slate-800 to-slate-700 mb-4">
         {tool.removed && <span className="text-red-500 font-bold mb-2">Produto removido</span>}
         <div>
            <input className={
              clsx(inputClasses,
                  "text-xl mb-2 font-bold text-slate-50 bg-gray-900",
                  {
                  'bg-gray-900': isEdit,
                  'cursor-text': isEdit
                })
              } 
              value={inputData.name}
              placeholder="Nome do produto"
              onChange={(e) => handleInputChange(InputEnum.Name, e.target.value)}
            />
            <input className={clsx(inputClasses, {
              'bg-gray-900': isEdit,
              'cursor-text': isEdit
            })} 
            value={inputData.details}
            placeholder="Detalhes do produto"
            onChange={(e) => handleInputChange(InputEnum.Details, e.target.value)}
            />
            <input className={clsx(inputClasses, {
              'bg-gray-900': isEdit,
              'cursor-text': isEdit
            })} 
            value={inputData.category}
            placeholder="Categoria"
            disabled
            />
            <input className={clsx(inputClasses, {
              'bg-gray-900': isEdit,
              'cursor-text': isEdit
            })} 
            value={inputData.price}
            placeholder="Preco do Produto"
            onChange={(e) => handleInputChange(InputEnum.Price, e.target.value)}
            />
            <input className={clsx(inputClasses, {
              'bg-gray-900': isEdit,
              'cursor-text': isEdit
            })} 
            value={inputData.image}
            placeholder="URL da Imagem"
            onChange={(e) => handleInputChange(InputEnum.Image, e.target.value)}
            />
         </div>
         {
          isEdit ?
            <>        
              <CheckIcon onClick={handleUpdate} className="h-6 w-6 text-green-500 absolute top-4 right-20 cursor-pointer" />
              {tool.removed ? (
                <ArrowPathRoundedSquareIcon
                  onClick={handleRestore}
                  className="h-6 w-6 text-green-700 absolute top-4 right-10 cursor-pointer"
                />
              ) : (
                <TrashIcon // Display delete icon if not removed
                  onClick={handleDelete}
                  className="h-6 w-6 text-red-900 absolute top-4 right-10 cursor-pointer"
                />
              )}
              <XCircleIcon onClick={onClose} className="h-6 w-6 text-slate-200 absolute top-4 right-2 cursor-pointer" />
            </> :
            <button className="btn btn-active btn-ghost block absolute top-4 right-4 p-0" onClick={toggleIsEdit}>
              <PencilSquareIcon className="h-6 w-6 text-slate-50 cursor-pointer" />
            </button>
        }
      </div>
    )
    }

export default ProductCard;