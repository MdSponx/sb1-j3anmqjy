import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import type { DirectorApplication } from '../types/application';

export function useApplications() {
  const { db } = useFirebase();
  const [applications, setApplications] = useState<DirectorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<DirectorApplication | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('occupation', '==', 'director')
        );
        const snapshot = await getDocs(q);
        const apps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DirectorApplication[];
        setApplications(apps);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [db]);

  const handleStatusChange = async (applicationId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'users', applicationId), {
        member_status: status,
        updated_at: new Date().toISOString()
      });
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, member_status: status } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePaymentVerification = async (applicationId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'users', applicationId), {
        payment_status: status,
        updated_at: new Date().toISOString()
      });
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, payment_status: status } : app
      ));

      if (status === 'paid') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          setSelectedApplication(application);
          setShowApprovalDialog(true);
        }
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;

    try {
      await updateDoc(doc(db, 'users', selectedApplication.id), {
        member_status: 'สามัญ',
        verification_status: 'approved',
        updated_at: new Date().toISOString()
      });

      setApplications(prev => prev.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, member_status: 'สามัญ', verification_status: 'approved' } 
          : app
      ));

      setShowApprovalDialog(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  return {
    applications,
    loading,
    selectedImage,
    showApprovalDialog,
    selectedApplication,
    handleStatusChange,
    handlePaymentVerification,
    handleApprove,
    handleImageSelect: setSelectedImage,
    handleCloseModal: () => setSelectedImage(null),
    handleCloseApproval: () => {
      setShowApprovalDialog(false);
      setSelectedApplication(null);
    }
  };
}