"use client";

import { Button } from "@/components/ui/button";
import { AddEventAccordionItem } from "@/components/sg/admin/AddEventAccordionItem";

interface EventProps {
    name: string;
    participants: number;
    status: string;
}

const AdminPage = () => {

    

    const showView = (viewId: string) => {
        // document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        // const view = document.getElementById(viewId);
        // if (view) view.classList.remove('hidden');
    };

    const showTab = (tabIndex: number) => {
        // document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
        // document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('text-blue-600', 'font-bold', 'border-blue-600', 'border-b-2'));
        // const tabContent = document.getElementById(`tab-content-${tabIndex}`);
        // if (tabContent) tabContent.classList.remove('hidden');
        // const stepBtn = document.getElementById(`step-${tabIndex}`);
        // if (stepBtn) stepBtn.classList.add('text-blue-600', 'font-bold', 'border-blue-600', 'border-b-2');
    };
    return (
    <>
        <div className="flex min-h-screen py-10">
            <aside className="w-64 bg-stone-200 p-6 rounded-xl">
                <h1 className="text-2xl font-bold mb-8 text-blue-400">Billeterie</h1>
                <nav className="space-y-4">
                    <a href="#" className="block py-2.5 px-4 rounded bg-blue-600">Créer un SG</a>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-slate-800 transition">Sg en cours</a>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-slate-800 transition">Réponses au SG </a>
                </nav>
            </aside>

            <main className="flex min-h-[calc(--custom-vh-(--spacing(32)))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <p>esrxdctfgyhu</p>
                <AddEventAccordionItem />
            </main>

            {/* <main className="flex-1 p-8">
                <div id="view-list" className="view">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Mes Évènements</h2>
                        <Button onClick={() => showView('view-edit')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                            + Créer un évènement
                        </Button>
                    </div>

                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Nom</th>
                                    <th className="p-4 font-semibold text-gray-600">Participants</th>
                                    <th className="p-4 font-semibold text-gray-600">Statut</th>
                                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">Festival de Jazz 2026</td>
                                    <td className="p-4">1,240 / 2,000</td>
                                    <td className="p-4">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium italic">En ligne</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button onClick={() => showView('view-edit')} className="text-blue-600 hover:text-blue-800 mr-4"><i className="fas fa-edit"></i> Modifier</Button>
                                        <Button className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="view-edit" className="view hidden">
                    <div className="mb-6">
                        <Button onClick={() => showView('view-list')} className="text-gray-500 hover:text-gray-700 mb-4">
                            <i className="fas fa-arrow-left"></i> Retour à la liste
                        </Button>
                        <h2 className="text-3xl font-bold text-gray-800">Modifier l'évènement</h2>
                    </div>

                    <div className="flex items-center justify-between mb-10 bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex flex-1 justify-around text-center">
                            <Button onClick={() => showTab(1)} id="step-1" className="step-btn text-blue-600 font-bold border-b-2 border-blue-600 pb-2 flex-1">1. Infos Générales</Button>
                            <Button onClick={() => showTab(2)} id="step-2" className="step-btn text-gray-400 flex-1">2. Sessions</Button>
                            <Button onClick={() => showTab(3)} id="step-3" className="step-btn text-gray-400 flex-1">3. Tarifs</Button>
                            <Button onClick={() => showTab(4)} id="step-4" className="step-btn text-gray-400 flex-1">4. Options</Button>
                            <Button onClick={() => showTab(5)} id="step-5" className="step-btn text-gray-400 flex-1">5. Infos Comp.</Button>
                        </div>
                    </div>

                    <div id="tab-1" className="tab-content bg-white p-8 rounded-xl shadow space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2">Nom de l'évènement</label>
                                <input type="text" className="border p-2 rounded focus:ring-2 focus:ring-blue-400" value="Festival de Jazz 2026" />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2">Visibilité</label>
                                <select className="border p-2 rounded">
                                    <option>Publié</option>
                                    <option>Brouillon</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2">Lieu</label>
                                <input type="text" className="border p-2 rounded" placeholder="Ex: Palais des Congrès" />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2">Quota Global (Optionnel)</label>
                                <input type="number" className="border p-2 rounded" placeholder="Illimité si vide" />
                            </div>
                        </div>
                        <div className="border-t pt-6">
                            <label className="flex items-center space-x-3 mb-4">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="font-semibold">Limiter à une seule session par personne</span>
                            </label>
                            <p className="text-sm text-gray-500 ml-7">Si activé, chaque participant ne pourra s'inscrire qu'à une seule session de cet évènement.</p>
                        </div>
                        <div className="pt-6 border-t">
                            <Button className="bg-red-50 text-red-600 px-4 py-2 rounded border border-red-200 hover:bg-red-100">Supprimer l'évènement</Button>
                        </div>
                    </div>

                    <div id="tab-2" className="tab-content hidden bg-white p-8 rounded-xl shadow space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">Sessions de l'évènement</h3>
                            <Button className="bg-gray-800 text-white px-4 py-2 rounded text-sm">+ Ajouter une session</Button>
                        </div>
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <div className="grid grid-cols-4 gap-4 mb-3 items-center">
                                    <input type="text" placeholder="Nom session" className="p-2 border rounded" value="Soirée d'ouverture" />
                                    <input type="datetime-local" className="p-2 border rounded" />
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" className="w-4 h-4" /> <span>Répétable</span>
                                    </label>
                                    <input type="number" placeholder="Quota" className="p-2 border rounded w-24" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 text-sm">
                                        <input type="checkbox" />
                                        <span>Inscription unique (une fois par personne)</span>
                                    </label>
                                    <Button className="text-red-500"><i className="fas fa-trash"></i></Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="tab-3" className="tab-content hidden bg-white p-8 rounded-xl shadow space-y-6">
                        <div className="border-b pb-6 mb-6">
                            <label className="flex items-center space-x-3 mb-2">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="font-semibold">Limiter à un seul billet par personne</span>
                            </label>
                            <p className="text-sm text-gray-500 ml-7">Si activé, chaque participant ne pourra acheter qu'un seul billet pour cet évènement (tous types confondus).</p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">Types de tickets</h3>
                            <Button className="bg-gray-800 text-white px-4 py-2 rounded text-sm">+ Ajouter un tarif</Button>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-2">Nom du ticket</th>
                                    <th className="pb-2">Sessions liées</th>
                                    <th className="pb-2 w-32">Prix (€)</th>
                                    <th className="pb-2">Contrainte / Rôle</th>
                                    <th className="pb-2">Quota</th>
                                    <th className="pb-2">Unique</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-4"><input type="text" className="border p-1 rounded" value="Pass Standard" /></td>
                                    <td className="py-4">
                                        <select multiple className="text-xs border rounded p-1 w-full">
                                            <option selected>Session 1</option>
                                            <option>Session 2</option>
                                        </select>
                                    </td>
                                    <td className="py-4"><input type="number" className="border p-1 rounded w-24 font-bold text-blue-600" value="45" /></td>
                                    <td className="py-4">
                                        <select className="text-xs border rounded p-1">
                                            <option>Aucune</option>
                                            <option>Étudiants</option>
                                            <option>Membres VIP</option>
                                        </select>
                                    </td>
                                    <td className="py-4"><input type="number" className="border p-1 rounded w-20" placeholder="∞" /></td>
                                    <td className="py-4 text-center">
                                        <input type="checkbox" className="w-4 h-4" title="Un seul par personne" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div id="tab-4" className="tab-content hidden bg-white p-8 rounded-xl shadow space-y-8">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <label className="font-bold text-blue-800 mr-4">Configurer les options pour :</label>
                            <select className="border p-1 rounded">
                                <option>Pass Standard</option>
                                <option>Pass VIP</option>
                            </select>
                        </div>

                        <div className="border rounded-xl p-6 bg-white shadow-sm relative border-l-4 border-l-blue-500">
                            <div className="flex justify-between mb-4">
                                <input type="text" className="font-bold text-lg border-b focus:border-blue-500 outline-none" value="Choix du repas" />
                                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs uppercase font-bold">Sélection d'item</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <input type="text" className="flex-1 border p-2 rounded" value="Végétarien" />
                                    <input type="number" className="w-24 border p-2 rounded text-green-600" placeholder="+ 0€" />
                                    <input type="number" className="w-20 border p-2 rounded" placeholder="Quota" />
                                    <Button className="text-gray-400"><i className="fas fa-times"></i></Button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input type="text" className="flex-1 border p-2 rounded" value="Menu Gastronomique" />
                                    <input type="number" className="w-24 border p-2 rounded text-green-600" value="15" />
                                    <input type="number" className="w-20 border p-2 rounded" placeholder="Quota" />
                                    <Button className="text-gray-400"><i className="fas fa-times"></i></Button>
                                </div>
                            </div>
                            <Button className="mt-4 text-blue-600 text-sm font-semibold hover:underline">+ Ajouter un choix</Button>
                        </div>

                        <div className="border rounded-xl p-6 bg-white shadow-sm border-l-4 border-l-gray-400">
                            <div className="flex justify-between mb-4">
                                <input type="text" className="font-bold text-lg border-b outline-none" value="Allergies éventuelles" />
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs uppercase font-bold">Texte libre</span>
                            </div>
                            <p className="text-sm text-gray-400 italic">Cette option ne peut pas être monétaire.</p>
                        </div>
                    </div>

                    <div id="tab-5" className="tab-content hidden bg-white p-8 rounded-xl shadow space-y-6">
                        <div>
                            <label className="font-semibold mb-2 block">Description de l'évènement</label>
                            <textarea className="w-full border p-4 rounded h-40" placeholder="Décrivez votre évènement ici..."></textarea>
                        </div>
                        <div>
                            <label className="font-semibold mb-2 block">Conditions générales de vente (spécifiques)</label>
                            <textarea className="w-full border p-4 rounded h-24" placeholder="Optionnel..."></textarea>
                        </div>
                    </div>

                </div>
            </main> */}
        </div>


    </>

)};

export default AdminPage;