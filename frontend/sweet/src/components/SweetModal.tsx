import React, { useState, useEffect } from 'react';
import { sweetAPI } from '../services/api';

interface Sweet {
    id?: number;
    name: string;
    category: string;
    price: string;
    quantity: number;
    description?: string;
    image_url?: string;
}

interface SweetModalProps {
    sweet: Sweet | null;
    onClose: () => void;
}

const SweetModal: React.FC<SweetModalProps> = ({ sweet, onClose }) => {
    const [formData, setFormData] = useState<Sweet>({
        name: '',
        category: '',
        price: '',
        quantity: 0,
        description: '',
        image_url: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (sweet) {
            setFormData(sweet);
        }
    }, [sweet]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (sweet?.id) {
                await sweetAPI.update(sweet.id, formData);
            } else {
                await sweetAPI.create(formData);
            }
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save sweet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="card-header">
                    {sweet ? 'Edit Sweet' : 'Add New Sweet'}
                </h2>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Chocolate Bar"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input
                            type="text"
                            name="category"
                            className="form-control"
                            placeholder="Chocolate"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            className="form-control"
                            placeholder="2.99"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            className="form-control"
                            placeholder="100"
                            min="0"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description (Optional)</label>
                        <textarea
                            name="description"
                            className="form-control"
                            placeholder="Delicious chocolate bar..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image URL (Optional)</label>
                        <input
                            type="url"
                            name="image_url"
                            className="form-control"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image_url}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : sweet ? 'Update Sweet' : 'Add Sweet'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ flex: 1 }}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SweetModal;
