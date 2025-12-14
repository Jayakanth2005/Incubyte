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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (sweet) {
            setFormData(sweet);
            if (sweet.image_url) {
                setImagePreview(`http://localhost:5000${sweet.image_url}`);
            }
        }
    }, [sweet]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Create FormData for file upload
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('price', formData.price);
            data.append('quantity', formData.quantity.toString());
            if (formData.description) {
                data.append('description', formData.description);
            }
            if (imageFile) {
                data.append('image', imageFile);
            }

            if (sweet?.id) {
                await sweetAPI.update(sweet.id, data);
            } else {
                await sweetAPI.create(data);
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
                        <label className="form-label">Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={handleImageChange}
                            style={{ padding: '0.5rem' }}
                        />
                        {imagePreview && (
                            <div style={{ marginTop: '1rem' }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '200px',
                                        maxHeight: '200px',
                                        borderRadius: '8px',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        )}
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
