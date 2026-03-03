import { Router } from 'express';
import { 
    addAddress, 
    getUserAddresses, 
    updateAddress, 
    deleteAddress 
} from '../controllers/address.controller';

const router = Router();

router.post('/', addAddress);
router.get('/:userId', getUserAddresses);
router.patch('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;