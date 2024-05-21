import { useDispatch } from "react-redux"
import useAxios from "./useAxios"
import {
  fetchStockStart,
  getFirmsSuccess,
  fetchStockFail,
  getStockSuccess,
  getProPurBraFirmSuccess,
} from "../features/stockSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const useStockRequest = () => {
const {axiosToken} = useAxios()
const dispatch = useDispatch()

  // const getFirms = async () => {
  //   dispatch(fetchStockStart());
  //   try {
  //     const {data} =await axiosToken("/firms")
  //     console.log(data);
  //     dispatch(getFirmsSuccess(data.data));
  //   } catch (error) {
  //     dispatch(fetchStockFail());
  //     console.log(error);
  //   }
  // }


  //? 7 tane fonksiyon yazmak yerine parametrik hale getirdik
    const getStock = async (path = "firms") => {
      dispatch(fetchStockStart());
      try {
        const { data } = await axiosToken(`/${path}`);
        console.log(data);
        const stockData = data.data;
        dispatch(getStockSuccess({ stockData, path }));
      } catch (error) {
        dispatch(fetchStockFail());
         toastErrorNotify(`${path} verileri çekilememiştir.`);
        console.log(error);
      }
    };


       const deleteStock = async (path="firms", id) => {
         dispatch(fetchStockStart());
         try {
          await axiosToken.delete(`/${path}/${id}`);
          toastSuccessNotify(`${path} basariliyla silinmiştir.`);
        getStock(path)
           
         } catch (error) {
           dispatch(fetchStockFail());
           toastErrorNotify(`${path} silinememiştir.`);
           console.log(error);
         }
       };

       const postStock = async (path = "firms", info) => {
         dispatch(fetchStockStart());
         try {
           await axiosToken.post(`/${path}/`, info);
           getStock(path);
           toastSuccessNotify(`${path} basariliyla eklenmiştir.`);
         } catch (error) {
           dispatch(fetchStockFail());
           toastErrorNotify(`${path} eklenememiştir.`);
           console.log(error);
         }
       };

       const putStock = async (path = "firms", info) => {
         dispatch(fetchStockStart());
         try {
           await axiosToken.put(`/${path}/${info._id}`, info);
           getStock(path);
         } catch (error) {
           dispatch(fetchStockFail());
           console.log(error);
         }
       };


       const getProPurBraFirmStock = async () => {
         dispatch(fetchStockStart());
         try {
           const [products, purchases, brands, firms] = await Promise.all([
             await axiosToken("/products"),
             await axiosToken("/purchases"),
             await axiosToken("/brands"),
             await axiosToken("/firms"),
           ]);
           console.log(products.data.data, firms);
           dispatch(getProPurBraFirmSuccess());
         } catch (error) {
           console.log(error);
         }
       };

  // return { getFirms};
  return { getStock, deleteStock, putStock, postStock, getProPurBraFirmStock };
}

export default useStockRequest