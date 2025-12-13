import React, { useState, useEffect } from 'react';
import { sweetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SweetCard from '../components/SweetCard';
import SweetModal from '../components/SweetModal';
import SearchBar from '../components/SearchBar';

interface Sweet {
    id: number;
    name: string;
    category: string;
    price: string;
    quantity: number;
    description?: string;
    image_url?: string;
}

const Dashboard: React.FC = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
    const [error, setError] = useState('');
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadSweets();
    }, []);

    const loadSweets = async () => {
        try {
            setLoading(true);
            const data = await sweetAPI.getAll();
            setSweets(data);
            setFilteredSweets(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load sweets');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (params: any) => {
        try {
            setLoading(true);
            const data = await sweetAPI.search(params);
            setFilteredSweets(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSweet = () => {
        setEditingSweet(null);
        setShowModal(true);
    };

    const handleEditSweet = (sweet: Sweet) => {
        setEditingSweet(sweet);
        setShowModal(true);
    };

    const handleDeleteSweet = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this sweet?')) {
            return;
        }

        try {
            await sweetAPI.delete(id);
            loadSweets();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete sweet');
        }
    };

    const handlePurchase = async (id: number, quantity: number) => {
        try {
            await sweetAPI.purchase(id, quantity);
            loadSweets();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Purchase failed');
        }
    };

    const handleRestock = async (id: number, quantity: number) => {
        try {
            await sweetAPI.restock(id, quantity);
            loadSweets();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Restock failed');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingSweet(null);
        loadSweets();
    };

    if (loading && sweets.length === 0) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div className="hero">
                <h1 className="hero-title">🍬 Sweet Shop</h1>
                <p className="hero-subtitle">
                    Discover our delicious collection of sweets and treats
                </p>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                        {isAdmin ? 'Manage Sweets' : 'Browse Sweets'}
                    </h2>
                    {isAdmin && (
                        <button className="btn btn-primary" onClick={handleAddSweet}>
                            + Add New Sweet
                        </button>
                    )}
                </div>

                <SearchBar onSearch={handleSearch} />
            </div>

            {filteredSweets.length === 0 ? (
                <div className="text-center" style={{ padding: '4rem 0' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.5rem' }}>
                        No sweets found
                    </h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isAdmin ? 'Add some sweets to get started!' : 'Check back later for new treats!'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-3">
                    {filteredSweets.map((sweet) => (
                        <SweetCard
                            key={sweet.id}
                            sweet={sweet}
                            isAdmin={isAdmin}
                            onEdit={handleEditSweet}
                            onDelete={handleDeleteSweet}
                            onPurchase={handlePurchase}
                            onRestock={handleRestock}
                        />
                    ))}
                </div>
            )}

            {showModal && (
                <SweetModal
                    sweet={editingSweet}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default Dashboard;
