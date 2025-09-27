import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, Clock, Baby, BookOpen, Hash, Building2, Tag } from 'lucide-react';

const API_BASE_URL = 'http://localhost:28088';

const ApiGameManagerApp = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    ean13: '',
    publisher: '',
    genre: '',
    min_number_of_players: '',
    max_number_of_players: '',
    min_age: '',
    typical_duration: ''
  });

  // Fetch all games from API
  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/games/`);
      if (!response.ok) throw new Error('Fehler beim Laden der Spiele');
      const data = await response.json();
      setGames(data);
      setError(null);
    } catch (err) {
      setError(`Verbindungsfehler: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      ean13: '',
      publisher: '',
      genre: '',
      min_number_of_players: '',
      max_number_of_players: '',
      min_age: '',
      typical_duration: ''
    });
    setEditingGame(null);
    setShowForm(false);
  };

  // Create or update game
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Titel ist erforderlich');
      return;
    }

    setLoading(true);
    try {
      const gameData = {
        ...formData,
        min_number_of_players: formData.min_number_of_players ? parseInt(formData.min_number_of_players) : null,
        max_number_of_players: formData.max_number_of_players ? parseInt(formData.max_number_of_players) : null,
        min_age: formData.min_age ? parseInt(formData.min_age) : null
      };

      let response;
      if (editingGame) {
        // Update existing game
        response = await fetch(`${API_BASE_URL}/games/${editingGame.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...gameData, id: editingGame.id })
        });
      } else {
        // Create new game
        response = await fetch(`${API_BASE_URL}/games/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gameData)
        });
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
      await fetchGames(); // Refresh the list
      resetForm();
      setError(null);
    } catch (err) {
      setError(`${editingGame ? 'Update' : 'Speichern'} fehlgeschlagen: ${err.message}`);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game) => {
    setFormData({
      title: game.title || '',
      ean13: game.ean13 || '',
      publisher: game.publisher || '',
      genre: game.genre || '',
      min_number_of_players: game.min_number_of_players || '',
      max_number_of_players: game.max_number_of_players || '',
      min_age: game.min_age || '',
      typical_duration: game.typical_duration || ''
    });
    setEditingGame(game);
    setShowForm(true);
  };

  // Delete game
  const handleDelete = async (id) => {
    if (!window.confirm('Sind Sie sicher, dass Sie dieses Spiel löschen möchten?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
      await fetchGames(); // Refresh the list
      setError(null);
    } catch (err) {
      setError(`Löschen fehlgeschlagen: ${err.message}`);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            🎲 API Spieleverwaltung
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Verbunden mit Backend
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-red-800 text-sm">{error}</div>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 text-xs underline mt-1"
            >
              Schließen
            </button>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-blue-800 text-sm flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              Wird geladen...
            </div>
          </div>
        )}

        {/* Add Game Button */}
        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          className="w-full mb-6 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Neues Spiel hinzufügen
        </button>

        {/* Game Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingGame ? 'Spiel bearbeiten' : 'Neues Spiel'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="z.B. Monopoly"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EAN-13
                </label>
                <input
                  type="text"
                  value={formData.ean13}
                  onChange={(e) => handleInputChange('ean13', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="z.B. 1234567890123"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => handleInputChange('publisher', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="z.B. Hasbro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="z.B. Strategie"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mindestalter
                </label>
                <input
                  type="number"
                  value={formData.min_age}
                  onChange={(e) => handleInputChange('min_age', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="z.B. 8"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min. Spieler
                  </label>
                  <input
                    type="number"
                    value={formData.min_number_of_players}
                    onChange={(e) => handleInputChange('min_number_of_players', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max. Spieler
                  </label>
                  <input
                    type="number"
                    value={formData.max_number_of_players}
                    onChange={(e) => handleInputChange('max_number_of_players', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="8"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Typische Spieldauer
                </label>
                <input
                  type="text"
                  value={formData.typical_duration}
                  onChange={(e) => handleInputChange('typical_duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="z.B. 30-60 Minuten"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Speichert...' : (editingGame ? 'Aktualisieren' : 'Hinzufügen')}
                </button>
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Games List */}
        <div className="space-y-4">
          {games.length === 0 && !loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-lg">Noch keine Spiele vorhanden</p>
              <p className="text-sm">Fügen Sie Ihr erstes Spiel hinzu!</p>
            </div>
          ) : (
            games.map(game => (
              <div key={game.id} className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {game.title}
                    </h3>
                    {game.ean13 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Hash size={12} />
                        <span>EAN: {game.ean13}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => handleEdit(game)}
                      disabled={loading}
                      className="p-2 text-blue-600 hover:bg-blue-50 disabled:text-gray-400 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(game.id)}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-50 disabled:text-gray-400 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {(game.publisher || game.genre) && (
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    {game.publisher && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Building2 size={14} className="text-orange-500" />
                        <span>{game.publisher}</span>
                      </div>
                    )}
                    {game.genre && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Tag size={14} className="text-pink-500" />
                        <span>{game.genre}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm">
                  {game.min_age && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Baby size={14} className="text-purple-500" />
                      <span>{game.min_age}+ Jahre</span>
                    </div>
                  )}
                  
                  {(game.min_number_of_players || game.max_number_of_players) && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users size={14} className="text-blue-500" />
                      <span>
                        {game.min_number_of_players && game.max_number_of_players 
                          ? `${game.min_number_of_players}-${game.max_number_of_players}`
                          : game.min_number_of_players || game.max_number_of_players
                        } Spieler
                      </span>
                    </div>
                  )}
                  
                  {game.typical_duration && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock size={14} className="text-green-500" />
                      <span>{game.typical_duration}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchGames}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Wird geladen...' : 'Liste aktualisieren'}
          </button>
        </div>

        {/* Stats */}
        {games.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="text-center text-gray-600">
              <span className="font-semibold text-gray-800">{games.length}</span> Spiel{games.length !== 1 ? 'e' : ''} in der Datenbank
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiGameManagerApp;