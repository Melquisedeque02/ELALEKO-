 
// ================== LOGIN/LOGOUT ==================== //
import { Login } from './Login'; 


// ================== PRODUTO ==================== //
import { ListProduto } from './list/ListProduto'; 
import { AddProduto } from './add/AddProduto'; 
import { AlterProduto } from './alter/AlterProduto'; 
import { DeleteProduto } from './delete/DeleteProduto'; 

// ================== CATEGORIA ==================== //
import { ListCategoria } from './list/ListCategoria'; 
import { AddCategoria } from './add/AddCategoria'; 
import { AlterCategoria } from './alter/AlterCategoria'; 
import { DeleteCategoria } from './delete/DeleteCategoria'; 


// ================== MESA ==================== //
import { ListMesa } from './list/ListMesa'; 
import { AddMesa } from './add/AddMesa'; 
import { AlterMesa } from './alter/AlterMesa'; 
import { DeleteMesa } from './delete/DeleteMesa'; 

// ================== USER ==================== //
import { ListUserId } from './list/ListUserId'; 
 import { ListUser } from './list/ListUser'; 
import { AddUser } from './add/AddUser'; 
import { AlterUser } from './alter/AlterUser'; 
import { DeleteUser } from './delete/DeleteUser'

// ================== PEDIDO ==================== //
import { CountPedidos } from './list/CountPedidos'; 
import { ListPedido } from './list/ListPedido';
import { ListPedidoPorMesa } from './list/ListPedidoPorMesa'; 
import { AlterPedido } from './alter/AlterPedido'; 
import { AddPedido } from './add/AddPedido'; 

const Api = {

  Login,
  ListProduto,
  ListCategoria,
  AddProduto,
  AlterProduto,
  DeleteProduto,
  AddCategoria,
  AlterCategoria,
  DeleteCategoria,
  ListMesa,
  AddMesa,
  AlterMesa,
  DeleteMesa,
  ListUserId,
  ListUser,
  AddUser,
  AlterUser,
  DeleteUser,
  CountPedidos,
  ListPedido,
  AlterPedido,
  ListPedidoPorMesa,
  AddPedido

 
  };


export default Api;