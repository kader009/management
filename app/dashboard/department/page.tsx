'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

interface Department {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export default function DepartmentPage() {
  const sampleDepartments: Department[] = [
    {
      id: 1,
      name: 'Cardiology',
      description: 'Heart and cardiovascular system care',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Neurology',
      description: 'Brain and nervous system disorders',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Orthopedics',
      description: 'Bone and joint treatments',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Pediatrics',
      description: 'Children healthcare services',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Emergency',
      description: '24/7 emergency medical services',
      status: 'Active',
    },
  ];

  const [departments, setDepartments] = useState<Department[]>(() => {
    if (typeof window !== 'undefined') {
      const savedDepartments = localStorage.getItem('departments');
      if (savedDepartments) {
        try {
          return JSON.parse(savedDepartments);
        } catch {
          localStorage.setItem(
            'departments',
            JSON.stringify(sampleDepartments)
          );
          return sampleDepartments;
        }
      } else {
        localStorage.setItem('departments', JSON.stringify(sampleDepartments));
        return sampleDepartments;
      }
    }
    return sampleDepartments;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [deleteConfirmRowId, setDeleteConfirmRowId] = useState<number | null>(
    null
  );

  // Save to localStorage whenever departments change
  useEffect(() => {
    if (departments.length > 0) {
      localStorage.setItem('departments', JSON.stringify(departments));
    }
  }, [departments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingDepartment) {
      // Update existing department
      setDepartments(
        departments.map((dept) =>
          dept.id === editingDepartment.id ? { ...dept, ...formData } : dept
        )
      );
      toast.success('Department updated successfully!');
      setEditingDepartment(null);
      setFormData({ name: '', description: '', status: 'Active' });
    } else {
      // Add new department
      const newDepartment: Department = {
        id:
          departments.length > 0
            ? Math.max(...departments.map((d) => d.id)) + 1
            : 1,
        ...formData,
      };
      setDepartments([...departments, newDepartment]);
      toast.success('Department added successfully!');
      setFormData({ name: '', description: '', status: 'Active' });
    }
  };

  const closeModal = () => {
    setEditingDepartment(null);
    setFormData({ name: '', description: '', status: 'Active' });
  };

  // Inline edit handlers
  const startInlineEdit = (dept: Department) => {
    setEditingRowId(dept.id);
    setFormData({
      name: dept.name,
      description: dept.description,
      status: dept.status,
    });
  };

  const cancelInlineEdit = () => {
    setEditingRowId(null);
    setFormData({ name: '', description: '', status: 'Active' });
  };

  const saveInlineEdit = (deptId: number) => {
    setDepartments(
      departments.map((dept) =>
        dept.id === deptId ? { ...dept, ...formData } : dept
      )
    );
    toast.success('Department updated successfully!');
    setEditingRowId(null);
    setFormData({ name: '', description: '', status: 'Active' });
  };

  const confirmDelete = (deptId: number) => {
    setDepartments(departments.filter((dept) => dept.id !== deptId));
    toast.success('Department deleted successfully!');
    setDeleteConfirmRowId(null);
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <ToastContainer />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Department Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage hospital departments
        </p>
      </div>

      {/* Main Grid - Form and Table side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Department Form - Left Side */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 sticky top-20">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 dark:text-gray-100 dark:bg-gray-700"
                  placeholder="Enter department name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-gray-900 dark:text-gray-100 dark:bg-gray-700"
                  placeholder="Enter description"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'Active' | 'Inactive',
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 dark:text-gray-100 dark:bg-gray-700"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="submit"
                  onClick={(e) => {
                    if (editingDepartment) {
                      e.preventDefault();
                      toast.info('Please use Update button to save changes');
                    }
                  }}
                  className="flex-1 px-4 py-2 text-sm bg-green-400 text-white rounded-lg hover:bg-green-500 transition font-medium"
                >
                  Add
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    if (!editingDepartment) {
                      e.preventDefault();
                      toast.info('Please select a department to update');
                    }
                  }}
                  className="flex-1 px-4 py-2 text-sm bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-medium"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editingDepartment) {
                      setDeleteConfirmRowId(editingDepartment.id);
                      closeModal();
                    } else {
                      toast.warning('Please select a department to delete');
                    }
                  }}
                  className="flex-1 px-4 py-2 text-sm bg-red-400 text-white rounded-lg hover:bg-red-500 transition font-medium"
                >
                  Delete
                </button>
                {editingDepartment && (
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Department Table - Right Side */}
        <div className="lg:col-span-2">
          {/* Search Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 dark:text-gray-100 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Department Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                    >
                      Department Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDepartments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        No departments found
                      </td>
                    </tr>
                  ) : (
                    filteredDepartments.map((dept) => (
                      <tr
                        key={dept.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          {dept.id}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {editingRowId === dept.id ? (
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-indigo-300 dark:border-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 dark:text-gray-100 dark:bg-gray-700"
                            />
                          ) : (
                            dept.name
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {editingRowId === dept.id ? (
                            <input
                              type="text"
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-indigo-300 dark:border-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 dark:text-gray-100 dark:bg-gray-700"
                            />
                          ) : (
                            dept.description
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {editingRowId === dept.id ? (
                            <select
                              value={formData.status}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  status: e.target.value as
                                    | 'Active'
                                    | 'Inactive',
                                })
                              }
                              className="px-2 py-1 border border-indigo-300 dark:border-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 dark:text-gray-100 dark:bg-gray-700 text-xs"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                dept.status === 'Active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {dept.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {editingRowId === dept.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => saveInlineEdit(dept.id)}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelInlineEdit}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : deleteConfirmRowId === dept.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => confirmDelete(dept.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmRowId(null)}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startInlineEdit(dept)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirmRowId(dept.id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
