import React, { useState } from 'react';

interface Sweet {
    id: number;
    name: string;
    category: string;
    price: string;
    quantity: number;
    description?: string;
    image_url?: string;
}

interface SweetCardProps {
    sweet: Sweet;
    isAdmin: boolean;
    onEdit: (sweet: Sweet) => void;
    onDelete: (id: number) => void;
    onPurchase: (id: number, quantity: number) => void;
    onRestock: (id: number, quantity: number) => void;
}

const SweetCard: React.FC<SweetCardProps> = ({
    sweet,
    isAdmin,
    onEdit,
    onDelete,
    onPurchase,
    onRestock,
}) => {
    const [purchaseQty, setPurchaseQty] = useState(1);
    const [restockQty, setRestockQty] = useState(10);
    const [showPurchase, setShowPurchase] = useState(false);
    const [showRestock, setShowRestock] = useState(false);

    const handlePurchase = () => {
        if (purchaseQty > 0 && purchaseQty <= sweet.quantity) {
            onPurchase(sweet.id, purchaseQty);
            setShowPurchase(false);
            setPurchaseQty(1);
        }
    };

    const handleRestock = () => {
        if (restockQty > 0) {
            onRestock(sweet.id, restockQty);
            setShowRestock(false);
            setRestockQty(10);
        }
    };

    const isOutOfStock = sweet.quantity === 0;
    const isLowStock = sweet.quantity > 0 && sweet.quantity < 10;

    return (
        <div className="sweet-card">
            {sweet.image_url ? (
                <img src={sweet.image_url} alt={sweet.name} className="sweet-image" />
            ) : (
                <div className="sweet-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                    🍬
                </div>
            )}

            <div className="sweet-content">
                <h3 className="sweet-name">{sweet.name}</h3>
                <span className="sweet-category">{sweet.category}</span>

                {sweet.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                        {sweet.description}
                    </p>
                )}

                <div className="sweet-price">${parseFloat(sweet.price).toFixed(2)}</div>

                <div className="sweet-quantity">
                    Stock: {sweet.quantity} {' '}
                    {isOutOfStock && <span className="badge badge-danger">Out of Stock</span>}
                    {isLowStock && <span className="badge badge-warning">Low Stock</span>}
                    {!isOutOfStock && !isLowStock && <span className="badge badge-success">In Stock</span>}
                </div>

                {!isAdmin && (
                    <>
                        {!showPurchase ? (
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                onClick={() => setShowPurchase(true)}
                                disabled={isOutOfStock}
                            >
                                {isOutOfStock ? 'Out of Stock' : 'Purchase'}
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    max={sweet.quantity}
                                    value={purchaseQty}
                                    onChange={(e) => setPurchaseQty(parseInt(e.target.value) || 1)}
                                    style={{ width: '80px' }}
                                />
                                <button className="btn btn-success" onClick={handlePurchase}>
                                    Buy
                                </button>
                                <button className="btn btn-outline" onClick={() => setShowPurchase(false)}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </>
                )}

                {isAdmin && (
                    <div className="sweet-actions">
                        <button
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                            onClick={() => onEdit(sweet)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-danger"
                            style={{ flex: 1 }}
                            onClick={() => onDelete(sweet.id)}
                        >
                            Delete
                        </button>
                    </div>
                )}

                {isAdmin && (
                    <div style={{ marginTop: '0.75rem' }}>
                        {!showRestock ? (
                            <button
                                className="btn btn-success"
                                style={{ width: '100%' }}
                                onClick={() => setShowRestock(true)}
                            >
                                Restock
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    value={restockQty}
                                    onChange={(e) => setRestockQty(parseInt(e.target.value) || 1)}
                                    style={{ width: '80px' }}
                                />
                                <button className="btn btn-success" onClick={handleRestock}>
                                    Add
                                </button>
                                <button className="btn btn-outline" onClick={() => setShowRestock(false)}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SweetCard;
