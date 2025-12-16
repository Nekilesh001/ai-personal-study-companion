import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";
import { api } from "../services/api";

interface Note {
  id: number;
  title: string;
  content: string;
  timestamp: Date;
}

export default function Notebook() {
  const navigate = useNavigate();
  const { savedContent } = useStudy();
  const [notes, setNotes] = useState<Note[]>(
    savedContent.map((content, index) => ({
      id: index + 1,
      title: `Note ${index + 1}`,
      content: content,
      timestamp: new Date()
    }))
  );
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const createNote = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    
    const note: Note = {
      id: Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      timestamp: new Date()
    };
    
    setNotes([note, ...notes]);
    setNewTitle("");
    setNewContent("");
    setIsCreating(false);
    setSelectedNote(note);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const generateQuizFromNote = async (content: string) => {
    try {
      const response = await api.post("/quiz-from-content", { content });
      navigate("/quiz", { state: { questions: response.data.questions } });
    } catch (error) {
      alert("Failed to generate quiz. Please try again.");
    }
  };

  const generateFlashcardsFromNote = async (content: string) => {
    try {
      const response = await api.post("/flashcards-from-content", { content });
      navigate("/flashcards", { state: { flashcards: response.data.flashcards } });
    } catch (error) {
      alert("Failed to generate flashcards. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📓 My Notebook</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsCreating(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              ➕ New Note
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Notes List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-gray-800">Notes ({notes.length})</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {notes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No notes yet. Create your first note!</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedNote?.id === note.id
                          ? "bg-blue-100 border-2 border-blue-300"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <h3 className="font-medium text-gray-800 truncate">{note.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {note.content.substring(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {note.timestamp.toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Note Content */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            {isCreating ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Create New Note</h2>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    placeholder="Write your note content here..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={15}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={createNote}
                      disabled={!newTitle.trim() || !newContent.trim()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      Save Note
                    </button>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedNote ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedNote.title}</h2>
                    <p className="text-sm text-gray-500">
                      Created: {selectedNote.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => generateQuizFromNote(selectedNote.content)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      🧠 Quiz
                    </button>
                    <button
                      onClick={() => generateFlashcardsFromNote(selectedNote.content)}
                      className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                    >
                      🃏 Cards
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {selectedNote.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 h-full flex items-center justify-center">
                <div>
                  <div className="text-6xl mb-4">📖</div>
                  <h3 className="text-xl font-semibold mb-2">Select a note to view</h3>
                  <p>Choose a note from the list or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}