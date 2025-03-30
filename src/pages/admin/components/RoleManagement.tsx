import React, { useState, useEffect, memo } from 'react';
import { X } from 'lucide-react';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}  from '../../../components/ui/select';
import { AssignmentConfirm } from './AssignmentDialog';
import { RemoveDialog } from './RemoveDialog';

interface AdminUser {
  id: string;
  email: string;
  web_role: string;
  fullname_th?: string;
  fullname_en?: string;
  occupation?: string;
}

interface RoleBadgeProps {
  type: 'role' | 'occupation';
  label: string;
}

const RoleBadge = memo(function RoleBadge({ type, label }: RoleBadgeProps) {
  const getBadgeColors = () => {
    if (type === 'role') {
      switch (label.toLowerCase()) {
        case 'admin':
          return 'bg-red-500/10 text-red-400';
        case 'editor':
          return 'bg-blue-500/10 text-blue-400';
        case 'blogger':
          return 'bg-lime-500/10 text-lime-400';
        default:
          return 'bg-gray-500/10 text-gray-400';
      }
    } else {
      switch (label.toLowerCase()) {
        case 'director':
          return 'bg-red-500/10 text-red-400';
        case 'crew':
          return 'bg-amber-500/10 text-amber-400';
        case 'school student':
          return 'bg-yellow-500/10 text-yellow-400';
        case 'college student':
          return 'bg-green-500/10 text-green-400';
        case 'general people':
          return 'bg-pink-500/10 text-pink-400';
        default:
          return 'bg-gray-500/10 text-gray-400';
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getBadgeColors()}`}
    >
      {label}
    </span>
  );
});

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'text-red-400';
    case 'editor':
      return 'text-blue-400';
    case 'blogger':
      return 'text-lime-400';
    default:
      return 'text-gray-400';
  }
};

export function RoleManagement() {
  const { db } = useFirebase();
  const { language } = useLanguage();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('editor');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [foundUser, setFoundUser] = useState<{
    id: string;
    email: string;
    fullname_th?: string;
    fullname_en?: string;
    occupation?: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [userToRemove, setUserToRemove] = useState<AdminUser | null>(null);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('web_role', 'in', ['admin', 'editor', 'blogger'])
        );
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email,
            web_role: data.web_role,
            fullname_th: data.fullname_th || '-',
            fullname_en: data.fullname_en || '-',
            occupation: data.occupation || '-',
          };
        }) as AdminUser[];
        setAdminUsers(users);
      } catch (error) {
        console.error('Error fetching admin users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminUsers();
  }, [db]);

  const handleAddAdmin = async () => {
    if (!db || !searchEmail.trim()) return;

    setError(null);
    setIsSearching(true);

    try {
      const emailLowerCase = searchEmail.trim().toLowerCase();
      const q = query(
        collection(db, 'users'),
        where('email', '==', emailLowerCase)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError(language === 'th' ? 'ไม่พบผู้ใช้งาน' : 'User not found');
        return;
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      // Check if user already has a role
      if (userData.web_role && userData.web_role !== 'user') {
        setError(
          language === 'th'
            ? 'ผู้ใช้มีสิทธิ์อยู่แล้ว'
            : 'User already has a role'
        );
        return;
      }

      // Set found user with all data once และให้แสดง dialog
      setFoundUser({
        id: userDoc.id,
        email: userData.email,
        fullname_th: userData.fullname_th || '-',
        fullname_en: userData.fullname_en || '-',
        occupation: userData.occupation || '-',
      });
      console.log('Found User Data:', userData); // เพิ่มบรรทัดนี้
      console.log('Set Found User:', foundUser);

      setShowConfirmDialog(true);
    } catch (error) {
      console.error('Error:', error);
      setError(
        language === 'th' ? 'เกิดข้อผิดพลาดในการค้นหา' : 'Error searching user'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirmAssignment = async () => {
    if (!foundUser) return;

    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'users', foundUser.id), {
        web_role: selectedRole,
        updated_at: new Date().toISOString(),
      });

      // Add new user to adminUsers state with all data
      setAdminUsers((prev) => [
        ...prev,
        {
          id: foundUser.id,
          email: foundUser.email,
          web_role: selectedRole,
          fullname_th: foundUser.fullname_th,
          fullname_en: foundUser.fullname_en,
          occupation: foundUser.occupation,
        },
      ]);

      // Reset form
      setSearchEmail('');
      setSelectedRole('editor');
      setError(null);
      setShowConfirmDialog(false);
      setFoundUser(null);
    } catch (error) {
      console.error('Error:', error);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการเพิ่มสิทธิ์'
          : 'Error adding role'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveRole = async () => {
    if (!db || !userToRemove) return;

    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'users', userToRemove.id), {
        web_role: 'user',
        updated_at: new Date().toISOString(),
      });

      setAdminUsers((prev) =>
        prev.filter((user) => user.id !== userToRemove.id)
      );
      setShowRemoveDialog(false);
      setUserToRemove(null);
    } catch (error) {
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการลบสิทธิ์'
          : 'Error removing role'
      );
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          {language === 'th' ? 'เพิ่มบทบาทผู้ใช้งาน' : 'Add User Role'}
        </h3>

        <div className="space-y-2">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder={language === 'th' ? 'อีเมลผู้ใช้' : 'User email'}
                className="pr-8"
                disabled={isSearching}
              />
              {searchEmail && (
                <button
                  onClick={() => {
                    setSearchEmail('');
                    setError(null);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  type="button"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <Select
  value={selectedRole}
  onValueChange={setSelectedRole}
  disabled={isSearching}
>
  <SelectTrigger className="w-32">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="editor">Editor</SelectItem>
    <SelectItem value="blogger">Blogger</SelectItem>
  </SelectContent>
</Select>

            <Button
              onClick={handleAddAdmin}
              className="bg-red-600 hover:bg-red-700 text-white w-32"
              disabled={isSearching}
            >
              {isSearching
                ? language === 'th'
                  ? 'กำลังค้นหา...'
                  : 'Searching...'
                : language === 'th'
                ? 'เพิ่มสิทธิ์'
                : 'Add Role'}
            </Button>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      </div>
      //user list
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-6">
          {language === 'th' ? 'รายชื่อผู้ดูแลระบบ' : 'Admin Users List'}
        </h3>

        {/* เพิ่ม sections แยกตาม role */}
        {['admin', 'editor', 'blogger'].map((role) => {
          const roleUsers = adminUsers.filter((user) => user.web_role === role);
          if (roleUsers.length === 0) return null;

          return (
            <div key={role} className="mb-8 last:mb-0">
              <h4 className="text-lg font-medium mb-4 flex items-center gap-3">
                <span
                  className={`${getRoleColor(role)} font-semibold uppercase`}
                >
                  {role}
                </span>
                <span className="text-gray-400 text-sm">
                  ({roleUsers.length})
                </span>
              </h4>

              <div className="space-y-3">
                {roleUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-gray-800 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="grid grid-cols-3 gap-3 flex-1">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">
                          {language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}
                        </p>
                        <p className="text-white text-sm">
                          {language === 'th'
                            ? user.fullname_th || '-'
                            : user.fullname_en || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-xs mb-1">
                          {language === 'th' ? 'อีเมล' : 'Email'}
                        </p>
                        <p className="text-white text-sm truncate">
                          {user.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-xs mb-1">
                          {language === 'th' ? 'อาชีพ' : 'Occupation'}
                        </p>
                        <RoleBadge
                          type="occupation"
                          label={user.occupation || '-'}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setUserToRemove(user);
                        setShowRemoveDialog(true);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 ml-4"
                    >
                      {language === 'th' ? 'ลบสิทธิ์' : 'Remove'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* แสดงข้อความเมื่อไม่มี user */}
        {adminUsers.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            {language === 'th'
              ? 'ไม่พบรายชื่อผู้ดูแลระบบ'
              : 'No admin users found'}
          </p>
        )}
      </div>
      {/* Assignment Confirmation Dialog */}
      {showConfirmDialog && foundUser && (
        <AssignmentConfirm
          isOpen={showConfirmDialog}
          onClose={() => {
            setShowConfirmDialog(false);
            setFoundUser(null);
          }}
          onConfirm={handleConfirmAssignment}
          userEmail={foundUser.email}
          fullname_th={foundUser.fullname_th}
          fullname_en={foundUser.fullname_en}
          occupation={foundUser.occupation}
          selectedRole={selectedRole}
          isProcessing={isProcessing}
        />
      )}
      {showRemoveDialog && userToRemove && (
        <RemoveDialog
          isOpen={showRemoveDialog}
          onClose={() => {
            setShowRemoveDialog(false);
            setUserToRemove(null);
          }}
          onConfirm={handleRemoveRole}
          userEmail={userToRemove.email}
          fullname_th={userToRemove.fullname_th}
          fullname_en={userToRemove.fullname_en}
          currentRole={userToRemove.web_role}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
