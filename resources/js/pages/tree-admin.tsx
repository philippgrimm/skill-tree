import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, Edit, Trash2, Menu } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// Setup axios with CSRF token
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.getAttribute('content');
}

// Types
interface Branch {
    id: number;
    name: string;
    description: string | null;
    branch_id: number | null;
}

interface Leaf {
    id: number;
    name: string;
    content: string;
    order: number;
    branch_id: number;
}

export default function TreeAdmin() {
    // State for branches and leaves
    const [branches, setBranches] = useState<Branch[]>([]);
    const [leaves, setLeaves] = useState<Leaf[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    // State for modal dialogs
    const [branchModalOpen, setBranchModalOpen] = useState(false);
    const [leafModalOpen, setLeafModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [branchForm, setBranchForm] = useState({
        id: 0,
        name: '',
        description: '',
        branch_id: null as number | null
    });

    const [leafForm, setLeafForm] = useState({
        id: 0,
        name: '',
        content: '',
        branch_id: selectedBranch?.id || 0
    });

    // Expanded state for branches
    const [expandedBranches, setExpandedBranches] = useState<Record<number, boolean>>({});
    // Child branches mapping (parent_id -> child branches)
    const [childBranches, setChildBranches] = useState<Record<number, Branch[]>>({});

    // Load branches on component mount
    useEffect(() => {
        fetchBranches();
    }, []);

    // Load leaves when a branch is selected
    useEffect(() => {
        if (selectedBranch) {
            fetchLeaves(selectedBranch.id);
        }
    }, [selectedBranch]);

    // Fetch all branches
    const fetchBranches = async () => {
        try {
            // Fetch only top-level branches
            const response = await axios.get('/api/branches');
            setBranches(response.data);

            // Select first branch if available and none selected
            if (response.data.length > 0 && !selectedBranch) {
                setSelectedBranch(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    // Fetch child branches for a parent branch
    const fetchChildBranches = async (parentId: number) => {
        try {
            const response = await axios.get(`/api/branches?parent_id=${parentId}`);
            // Combine parent and child branches in the UI
            // or handle them separately as needed
            return response.data;
        } catch (error) {
            console.error(`Error fetching child branches for parent ${parentId}:`, error);
            return [];
        }
    };

    // Fetch leaves for a branch
    const fetchLeaves = async (branchId: number) => {
        try {
            const response = await axios.get(`/api/branches/${branchId}/leaves`);
            setLeaves(response.data);
        } catch (error) {
            console.error(`Error fetching leaves for branch ${branchId}:`, error);
        }
    };

    // Handle branch form submission
    const handleBranchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await axios.put(`/api/branches/${branchForm.id}`, branchForm);
            } else {
                await axios.post('/api/branches', branchForm);
            }

            // Reset form and refresh branches
            setBranchForm({ id: 0, name: '', description: '', branch_id: null });
            setBranchModalOpen(false);
            setIsEditing(false);

            // Refresh the branches list
            fetchBranches();

            // If we just edited or created a child branch, make sure to refresh child branches
            if (branchForm.branch_id && expandedBranches[branchForm.branch_id]) {
                const children = await fetchChildBranches(branchForm.branch_id);
                setChildBranches({
                    ...childBranches,
                    [branchForm.branch_id]: children
                });
            }
        } catch (error) {
            console.error('Error saving branch:', error);
        }
    };

    // Handle leaf form submission
    const handleLeafSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await axios.put(`/api/leaves/${leafForm.id}`, leafForm);
            } else {
                await axios.post('/api/leaves', {
                    ...leafForm,
                    branch_id: selectedBranch?.id
                });
            }

            // Reset form and refresh leaves
            setLeafForm({ id: 0, name: '', content: '', branch_id: selectedBranch?.id || 0 });
            setLeafModalOpen(false);
            setIsEditing(false);

            if (selectedBranch) {
                fetchLeaves(selectedBranch.id);
            }
        } catch (error) {
            console.error('Error saving leaf:', error);
        }
    };

    // Delete a branch
    const deleteBranch = async (id: number) => {
        if (!confirm('Are you sure you want to delete this branch? All leaves in this branch will also be deleted.')) {
            return;
        }

        try {
            await axios.delete(`/api/branches/${id}`);

            // If deleted branch was selected, clear selection
            if (selectedBranch?.id === id) {
                setSelectedBranch(null);
                setLeaves([]);
            }

            fetchBranches();
        } catch (error) {
            console.error(`Error deleting branch ${id}:`, error);
        }
    };

    // Delete a leaf
    const deleteLeaf = async (id: number) => {
        if (!confirm('Are you sure you want to delete this leaf?')) {
            return;
        }

        try {
            await axios.delete(`/api/leaves/${id}`);

            if (selectedBranch) {
                fetchLeaves(selectedBranch.id);
            }
        } catch (error) {
            console.error(`Error deleting leaf ${id}:`, error);
        }
    };

    // Prepare branch editing
    const editBranch = (branch: Branch) => {
        setBranchForm({
            id: branch.id,
            name: branch.name,
            description: branch.description || '',
            branch_id: branch.branch_id
        });
        setIsEditing(true);
        setBranchModalOpen(true);
    };

    // Prepare leaf editing
    const editLeaf = (leaf: Leaf) => {
        setLeafForm({
            id: leaf.id,
            name: leaf.name,
            content: leaf.content,
            branch_id: leaf.branch_id
        });
        setIsEditing(true);
        setLeafModalOpen(true);
    };

    // Handle drag and drop reordering of leaves
    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        // Reorder leaves array
        const reorderedLeaves = Array.from(leaves);
        const [removed] = reorderedLeaves.splice(sourceIndex, 1);
        reorderedLeaves.splice(destinationIndex, 0, removed);

        // Update local state immediately for responsive UI
        setLeaves(reorderedLeaves);

        // Send updated order to backend
        try {
            await axios.post(`/api/branches/${selectedBranch?.id}/reorder-leaves`, {
                leafIds: reorderedLeaves.map(leaf => leaf.id)
            });
        } catch (error) {
            console.error('Error reordering leaves:', error);
            // Revert to original order if there's an error
            fetchLeaves(selectedBranch?.id || 0);
        }
    };

    // Reset form when opening create modals
    const openNewBranchModal = () => {
        setBranchForm({ id: 0, name: '', description: '', branch_id: null });
        setIsEditing(false);
        setBranchModalOpen(true);
    };

    const openNewLeafModal = () => {
        setLeafForm({ id: 0, name: '', content: '', branch_id: selectedBranch?.id || 0 });
        setIsEditing(false);
        setLeafModalOpen(true);
    };

    // Toggle branch expansion
    const toggleBranchExpansion = async (branchId: number) => {
        if (expandedBranches[branchId]) {
            // If already expanded, collapse
            setExpandedBranches({
                ...expandedBranches,
                [branchId]: false
            });
        } else {
            // If not expanded, fetch child branches and expand
            const children = await fetchChildBranches(branchId);
            setChildBranches({
                ...childBranches,
                [branchId]: children
            });
            setExpandedBranches({
                ...expandedBranches,
                [branchId]: true
            });
        }
    };

    // Render a branch item with its children
    const renderBranchItem = (branch: Branch, isChild: boolean = false) => (
        <div key={branch.id}>
            <div
                className={`p-3 rounded-lg flex items-center justify-between cursor-pointer ${
                    selectedBranch?.id === branch.id
                        ? 'bg-primary text-primary-foreground'
                        : isChild ? 'bg-muted/50 hover:bg-muted' : 'bg-card hover:bg-muted'
                } ${isChild ? 'ml-4 border-l-2 border-muted' : ''}`}
                onClick={() => setSelectedBranch(branch)}
            >
                <div>
                    <div className="font-medium">{branch.name}</div>
                    {branch.description && (
                        <div className="text-xs opacity-80">{branch.description}</div>
                    )}
                </div>
                <div className="flex items-center">
                    {!isChild && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 mr-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleBranchExpansion(branch.id);
                            }}
                        >
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${expandedBranches[branch.id] ? 'rotate-180' : ''}`}
                            />
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => editBranch(branch)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit Branch
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteBranch(branch.id)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Branch
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Render child branches if expanded */}
            {expandedBranches[branch.id] && childBranches[branch.id]?.length > 0 && (
                <div className="mt-1 space-y-1">
                    {childBranches[branch.id].map(childBranch =>
                        renderBranchItem(childBranch, true)
                    )}
                </div>
            )}
        </div>
    );

    return (
        <AppLayout>
            <Head title="Tree Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Tree Administration</h1>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
                    {/* Branches Panel */}
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl">Branches</CardTitle>
                            <Button size="sm" onClick={openNewBranchModal}>
                                <Plus className="h-4 w-4 mr-1" /> New Branch
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {branches.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No branches found. Create one to get started.
                                    </div>
                                ) : (
                                    branches.map(branch => renderBranchItem(branch))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leaves Panel */}
                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl">
                                {selectedBranch ? `Leaves in ${selectedBranch.name}` : 'Leaves'}
                            </CardTitle>
                            {selectedBranch && (
                                <Button size="sm" onClick={openNewLeafModal}>
                                    <Plus className="h-4 w-4 mr-1" /> New Leaf
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {!selectedBranch ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    Select a branch to view its leaves
                                </div>
                            ) : leaves.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    No leaves found in this branch. Create one to get started.
                                </div>
                            ) : (
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="leaves">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="space-y-2"
                                            >
                                                {leaves.map((leaf, index) => (
                                                    <Draggable key={leaf.id} draggableId={leaf.id.toString()} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className="p-3 rounded-lg bg-card hover:bg-muted flex items-center justify-between"
                                                            >
                                                                <div className="flex items-center">
                                                                    <div {...provided.dragHandleProps} className="mr-2">
                                                                        <Menu className="h-4 w-4 text-muted-foreground" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium">{leaf.name}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editLeaf(leaf)}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => deleteLeaf(leaf.id)}>
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Branch Modal */}
                <Dialog open={branchModalOpen} onOpenChange={setBranchModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Branch' : 'Create New Branch'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleBranchSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                <Input
                                    id="name"
                                    value={branchForm.name}
                                    onChange={(e) => setBranchForm({...branchForm, name: e.target.value})}
                                    placeholder="Enter branch name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
                                <Input
                                    id="description"
                                    value={branchForm.description}
                                    onChange={(e) => setBranchForm({...branchForm, description: e.target.value})}
                                    placeholder="Enter branch description"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="parent" className="text-sm font-medium">Parent Branch (optional)</label>
                                <select
                                    id="parent"
                                    value={branchForm.branch_id?.toString() || ""}
                                    onChange={(e) => setBranchForm({
                                        ...branchForm,
                                        branch_id: e.target.value ? parseInt(e.target.value, 10) : null
                                    })}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="">None (Top Level)</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id.toString()}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setBranchModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {isEditing ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Leaf Modal */}
                <Dialog open={leafModalOpen} onOpenChange={setLeafModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Leaf' : 'Create New Leaf'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleLeafSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="leafName" className="text-sm font-medium">Name</label>
                                <Input
                                    id="leafName"
                                    value={leafForm.name}
                                    onChange={(e) => setLeafForm({...leafForm, name: e.target.value})}
                                    placeholder="Enter leaf name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="content" className="text-sm font-medium">Content</label>
                                <div className="border rounded-md">
                                    <textarea
                                        id="content"
                                        value={leafForm.content}
                                        onChange={(e) => setLeafForm({...leafForm, content: e.target.value})}
                                        className="w-full h-32 p-2 rounded-md resize-none focus:outline-none"
                                        placeholder="Enter leaf content"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setLeafModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {isEditing ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
