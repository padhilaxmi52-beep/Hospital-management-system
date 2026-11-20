import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const DEFAULT_USERS = [
  { id: 'U1', email: 'admin@hospital.com', password: '123', name: 'Super Admin', role: 'admin' },
  { id: 'U2', email: 'doctor@hospital.com', password: '123', name: 'Dr. John Smith', role: 'doctor' },
  { id: 'U3', email: 'staff@hospital.com', password: '123', name: 'Nurse Joy', role: 'staff' },
  { id: 'U4', email: 'patient@hospital.com', password: '123', name: 'Sarah Connor', role: 'patient' }
];

const DEFAULT_DOCTORS = [
  {
    id: 'DOC-001',
    name: 'Dr. John Smith',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD',
    salary: 150000,
    email: 'doctor@hospital.com'
  },
  {
    id: 'DOC-002',
    name: 'Dr. Emily Stone',
    specialization: 'Neurology',
    qualification: 'MBBS, PhD',
    salary: 180000,
    email: 'emily@hospital.com'
  },
  {
    id: 'DOC-003',
    name: 'Dr. Alan Grant',
    specialization: 'Pediatrics',
    qualification: 'MBBS',
    salary: 120000,
    email: 'alan@hospital.com'
  }
];

const DEFAULT_PATIENTS = [
  {
    id: 'PAT-001',
    name: 'Sarah Connor',
    address: '123 Tech Blvd',
    diagnosis: 'Flu',
    admissionDate: '2023-10-01',
    doctorId: 'DOC-001'
  },
  {
    id: 'PAT-002',
    name: 'Alex Mercer',
    address: '007 Secret Ln',
    diagnosis: 'Fracture',
    admissionDate: '2023-10-05',
    doctorId: 'DOC-002'
  },
  {
    id: 'PAT-003',
    name: 'Bruce Wayne',
    address: 'Wayne Manor',
    diagnosis: 'Back Pain',
    admissionDate: '2023-10-12',
    doctorId: 'DOC-003'
  }
];

const DEFAULT_EMPLOYEES = [
  {
    id: 'EMP-001',
    name: 'Nurse Joy',
    role: 'Nurse',
    email: 'joy@hospital.com'
  },
  {
    id: 'EMP-002',
    name: 'Officer Jenny',
    role: 'Security',
    email: 'jenny@hospital.com'
  },
  {
    id: 'EMP-003',
    name: 'Brock',
    role: 'Receptionist',
    email: 'brock@hospital.com'
  }
];

const DEFAULT_RECORDS = [
  {
    id: 'REC-001',
    patientId: 'PAT-001',
    date: '2023-10-01',
    problem: 'High Fever',
    description: 'Patient reports high fever and chills. Prescribed rest and paracetamol.',
    doctorId: 'DOC-001'
  },
  {
    id: 'REC-002',
    patientId: 'PAT-002',
    date: '2023-10-05',
    problem: 'Fractured Arm',
    description: 'Fell from a height. X-ray confirms hairline fracture. Applied splint.',
    doctorId: 'DOC-002'
  }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: 'APP-001',
    patientId: 'PAT-001',
    doctorId: 'DOC-001',
    date: '2026-06-20',
    time: '10:00 AM',
    reason: 'General Checkup',
    status: 'Pending'
  }
];

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [session, setSession] = useState(null);

  // Initialize DB from localStorage or defaults
  useEffect(() => {
    const initStorage = (key, defaultValue) => {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(stored);
    };

    setUsers(initStorage('users', DEFAULT_USERS));
    setDoctors(initStorage('doctors', DEFAULT_DOCTORS));
    setPatients(initStorage('patients', DEFAULT_PATIENTS));
    setEmployees(initStorage('employees', DEFAULT_EMPLOYEES));
    setRecords(initStorage('records', DEFAULT_RECORDS));
    setAppointments(initStorage('appointments', DEFAULT_APPOINTMENTS));
    
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
  }, []);

  // Sync state helper
  const updateStorage = (key, value, setter) => {
    localStorage.setItem(key, JSON.stringify(value));
    setter(value);
  };

  // Generate clean sequential/random IDs
  const generateId = (prefix) => {
    return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // AUTH ACTIONS
  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const sessionData = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        loginTime: new Date().toISOString()
      };
      updateStorage('session', sessionData, setSession);
      return user;
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem('session');
    setSession(null);
  };

  const registerPatient = (name, email, password, address) => {
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email already registered.' };
    }

    const patientId = generateId('PAT');
    const newPatient = {
      id: patientId,
      name,
      address,
      diagnosis: 'Healthy (New Patient)',
      admissionDate: new Date().toISOString().split('T')[0],
      doctorId: doctors.length > 0 ? doctors[0].id : ''
    };

    const newUser = {
      id: patientId, // keep IDs aligned for patients
      email,
      password,
      name,
      role: 'patient'
    };

    const updatedPatients = [...patients, newPatient];
    const updatedUsers = [...users, newUser];

    updateStorage('patients', updatedPatients, setPatients);
    updateStorage('users', updatedUsers, setUsers);

    return { success: true, user: newUser };
  };

  // PATIENT ACTIONS
  const addPatient = (patientData) => {
    const id = generateId('PAT');
    const newPatient = { ...patientData, id };
    const updated = [...patients, newPatient];
    updateStorage('patients', updated, setPatients);

    // Also add a default patient user so they can login
    const newUser = {
      id,
      email: `${patientData.name.toLowerCase().replace(/\s+/g, '')}@hospital.com`,
      password: '123',
      name: patientData.name,
      role: 'patient'
    };
    const updatedUsers = [...users, newUser];
    updateStorage('users', updatedUsers, setUsers);
  };

  const deletePatient = (id) => {
    const updatedPatients = patients.filter(p => p.id !== id);
    const updatedUsers = users.filter(u => u.id !== id);
    updateStorage('patients', updatedPatients, setPatients);
    updateStorage('users', updatedUsers, setUsers);
    
    // Clean up related appointments & records
    const updatedAppointments = appointments.filter(a => a.patientId !== id);
    const updatedRecords = records.filter(r => r.patientId !== id);
    updateStorage('appointments', updatedAppointments, setAppointments);
    updateStorage('records', updatedRecords, setRecords);
  };

  const updatePatientProfile = (id, updatedData) => {
    const updatedPatients = patients.map(p => p.id === id ? { ...p, ...updatedData } : p);
    const updatedUsers = users.map(u => u.id === id ? { ...u, name: updatedData.name, email: updatedData.email } : u);
    
    updateStorage('patients', updatedPatients, setPatients);
    updateStorage('users', updatedUsers, setUsers);

    // Update current session if the logged in patient changed their details
    if (session && session.user.id === id) {
      const newSession = {
        ...session,
        user: {
          ...session.user,
          name: updatedData.name,
          email: updatedData.email
        }
      };
      updateStorage('session', newSession, setSession);
    }
  };

  // DOCTOR ACTIONS
  const addDoctor = (doctorData) => {
    const id = generateId('DOC');
    const newDoctor = { ...doctorData, id };
    const updated = [...doctors, newDoctor];
    updateStorage('doctors', updated, setDoctors);

    // Also create a doctor user account
    const newUser = {
      id,
      email: doctorData.email || `${doctorData.name.toLowerCase().replace(/\s+/g, '')}@hospital.com`,
      password: '123',
      name: doctorData.name,
      role: 'doctor'
    };
    const updatedUsers = [...users, newUser];
    updateStorage('users', updatedUsers, setUsers);
  };

  const deleteDoctor = (id) => {
    const updatedDoctors = doctors.filter(d => d.id !== id);
    const updatedUsers = users.filter(u => u.id !== id);
    updateStorage('doctors', updatedDoctors, setDoctors);
    updateStorage('users', updatedUsers, setUsers);
  };

  // MEDICAL RECORD ACTIONS
  const addRecord = (recordData) => {
    const id = generateId('REC');
    const newRecord = { 
      ...recordData, 
      id, 
      date: new Date().toISOString().split('T')[0] 
    };
    const updated = [...records, newRecord];
    updateStorage('records', updated, setRecords);
  };

  // APPOINTMENT ACTIONS
  const bookAppointment = (appData) => {
    const id = generateId('APP');
    const newApp = { 
      ...appData, 
      id, 
      status: 'Pending' 
    };
    const updated = [...appointments, newApp];
    updateStorage('appointments', updated, setAppointments);
  };

  const updateAppointmentStatus = (id, status) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
    updateStorage('appointments', updated, setAppointments);
  };

  const getStats = () => {
    return {
      patients: patients.length,
      doctors: doctors.length,
      employees: employees.length,
      records: records.length,
      appointments: appointments.length
    };
  };

  return (
    <AppContext.Provider value={{
      users,
      doctors,
      patients,
      employees,
      records,
      appointments,
      session,
      login,
      logout,
      registerPatient,
      addPatient,
      deletePatient,
      updatePatientProfile,
      addDoctor,
      deleteDoctor,
      addRecord,
      bookAppointment,
      updateAppointmentStatus,
      getStats
    }}>
      {children}
    </AppContext.Provider>
  );
};



// import React, { createContext, useState, useEffect } from 'react';
// import authService from '../services/authService';
// import patientService from '../services/patientService';
// import doctorService from '../services/doctorService';
// import employeeService from '../services/employeeService';
// import recordService from '../services/recordService';
// import appointmentService from '../services/appointmentService';
// import statsService from '../services/statsService';

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//     const [doctors, setDoctors] = useState([]);
//     const [patients, setPatients] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [records, setRecords] = useState([]);
//     const [appointments, setAppointments] = useState([]);
//     const [session, setSession] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     // ✅ Add this to prevent multiple loads
//     const [isLoaded, setIsLoaded] = useState(false);

//     // ============================================================
//     // ✅ FIXED: LOAD DATA ONCE - Runs only on mount
//     // ============================================================
//     useEffect(() => {
//         // ✅ Prevent double loading
//         if (isLoaded) return;
        
//         const loadData = async () => {
//             try {
//                 setLoading(true);
//                 console.log(' Loading data from database...');

//                 const user = authService.getCurrentUser();
//                 if (user) {
//                     setSession({ user });
//                 }

//                 const [patientsRes, doctorsRes, employeesRes, recordsRes, appointmentsRes] = await Promise.all([
//                     patientService.getAll().catch(() => ({ patients: [] })),
//                     doctorService.getAll().catch(() => ({ doctors: [] })),
//                     employeeService.getAll().catch(() => ({ employees: [] })),
//                     recordService.getAll().catch(() => ({ records: [] })),
//                     appointmentService.getAll().catch(() => ({ appointments: [] }))
//                 ]);

//                 setPatients(patientsRes.patients || []);
//                 setDoctors(doctorsRes.doctors || []);
//                 setEmployees(employeesRes.employees || []);
//                 setRecords(recordsRes.records || []);
//                 setAppointments(appointmentsRes.appointments || []);
                
//                 // ✅ Mark as loaded
//                 setIsLoaded(true);
//                 console.log('✅ Data loaded from DATABASE');
//             } catch (error) {
//                 console.error('❌ Failed to load data:', error);
//                 setError('Failed to connect to server.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         // loadData();
//     }, [isLoaded]); // ✅ Runs only once

//     // ============================================================
//     // AUTH ACTIONS
//     // ============================================================

//     const login = async (email, password) => {
//         try {
//             setError(null);
//             console.log('🔐 Logging in...', { email });
            
//             const data = await authService.login(email, password);
            
//             if (data.success) {
//                 setSession({ user: data.user });
//                 // ✅ Refresh data after login
//                 await refreshData();
//                 console.log('✅ Login successful:', data.user.name);
//                 return data.user;
//             }
            
//             setError('Invalid email or password');
//             return null;
//         } catch (error) {
//             console.error('❌ Login error:', error);
//             setError(error.response?.data?.message || 'Login failed');
//             return null;
//         }
//     };

//     const logout = () => {
//         authService.logout();
//         setSession(null);
//         setPatients([]);
//         setDoctors([]);
//         setEmployees([]);
//         setRecords([]);
//         setAppointments([]);
//         // ✅ Reset load state so data loads on next login
//         setIsLoaded(false);
//         console.log('👋 Logged out');
//     };

//     const registerPatient = async (name, email, password, address, phone) => {
//         try {
//             setError(null);
//             console.log('📝 Registering patient:', { name, email });
            
//             const data = await authService.register({ 
//                 name, 
//                 email, 
//                 password, 
//                 address, 
//                 phone: phone || '9876543210'
//             });
            
//             if (data.success) {
//                 setSession({ user: data.user });
//                 await refreshData();
//                 return { success: true, user: data.user };
//             }
            
//             setError(data.message || 'Registration failed');
//             return { success: false, message: data.message };
//         } catch (error) {
//             console.error('❌ Register error:', error);
//             const errorMessage = error.response?.data?.message || 'Registration failed';
//             setError(errorMessage);
//             return { success: false, message: errorMessage };
//         }
//     };

//     // ============================================================
//     // REFRESH DATA - Called manually
//     // ============================================================

//     const refreshData = async () => {
//         try {
//             console.log('🔄 Refreshing data from database...');
            
//             const [patientsRes, doctorsRes, employeesRes, recordsRes, appointmentsRes] = await Promise.all([
//                 patientService.getAll().catch(() => ({ patients: [] })),
//                 doctorService.getAll().catch(() => ({ doctors: [] })),
//                 employeeService.getAll().catch(() => ({ employees: [] })),
//                 recordService.getAll().catch(() => ({ records: [] })),
//                 appointmentService.getAll().catch(() => ({ appointments: [] }))
//             ]);

//             setPatients(patientsRes.patients || []);
//             setDoctors(doctorsRes.doctors || []);
//             setEmployees(employeesRes.employees || []);
//             setRecords(recordsRes.records || []);
//             setAppointments(appointmentsRes.appointments || []);
            
//             console.log('✅ Data refreshed from database');
//         } catch (error) {
//             console.error('❌ Refresh data error:', error);
//         }
//     };

//     // ============================================================
//     // PATIENT ACTIONS
//     // ============================================================

//     const addPatient = async (patientData) => {
//         try {
//             setError(null);
//             console.log('📤 Adding patient:', patientData);
            
//             const data = await patientService.create(patientData);
            
//             if (data.success) {
//                 console.log('✅ Patient saved to DATABASE:', data.patient);
//                 await refreshData();
//                 return data.patient;
//             }
            
//             setError(data.message || 'Failed to add patient');
//             return null;
//         } catch (error) {
//             console.error('❌ Add patient error:', error);
//             setError(error.response?.data?.message || 'Failed to add patient');
//             return null;
//         }
//     };

//     const deletePatient = async (id) => {
//         try {
//             setError(null);
//             console.log('🗑️ Deleting patient:', id);
            
//             const data = await patientService.delete(id);
            
//             if (data.success) {
//                 await refreshData();
//                 return true;
//             }
            
//             setError(data.message || 'Failed to delete patient');
//             return false;
//         } catch (error) {
//             console.error('❌ Delete patient error:', error);
//             setError(error.response?.data?.message || 'Failed to delete patient');
//             return false;
//         }
//     };

//     const updatePatientProfile = async (id, data) => {
//         try {
//             setError(null);
//             console.log('📝 Updating patient:', id);
            
//             const response = await patientService.update(id, data);
            
//             if (response.success) {
//                 await refreshData();
//                 if (session?.user?.id === id) {
//                     const updatedUser = { ...session.user, name: data.name, email: data.email };
//                     localStorage.setItem('user', JSON.stringify(updatedUser));
//                     setSession({ user: updatedUser });
//                 }
//                 return true;
//             }
            
//             setError(response.message || 'Failed to update patient');
//             return false;
//         } catch (error) {
//             console.error('❌ Update patient error:', error);
//             setError(error.response?.data?.message || 'Failed to update patient');
//             return false;
//         }
//     };

//     // ============================================================
//     // DOCTOR ACTIONS
//     // ============================================================

//     const addDoctor = async (doctorData) => {
//         try {
//             setError(null);
//             console.log('👨‍⚕️ Adding doctor:', doctorData.name);
            
//             const data = await doctorService.create(doctorData);
            
//             if (data.success) {
//                 await refreshData();
//                 return data.doctor;
//             }
            
//             setError(data.message || 'Failed to add doctor');
//             return null;
//         } catch (error) {
//             console.error('❌ Add doctor error:', error);
//             setError(error.response?.data?.message || 'Failed to add doctor');
//             return null;
//         }
//     };

//     const deleteDoctor = async (id) => {
//         try {
//             setError(null);
//             console.log('🗑️ Deleting doctor:', id);
            
//             const data = await doctorService.delete(id);
            
//             if (data.success) {
//                 await refreshData();
//                 return true;
//             }
            
//             setError(data.message || 'Failed to delete doctor');
//             return false;
//         } catch (error) {
//             console.error('❌ Delete doctor error:', error);
//             setError(error.response?.data?.message || 'Failed to delete doctor');
//             return false;
//         }
//     };

//     // ============================================================
//     // RECORD ACTIONS
//     // ============================================================

//     const addRecord = async (recordData) => {
//         try {
//             setError(null);
//             console.log('📋 Adding medical record:', recordData);
            
//             const data = await recordService.create(recordData);
            
//             if (data.success) {
//                 await refreshData();
//                 return data.record;
//             }
            
//             setError(data.message || 'Failed to add record');
//             return null;
//         } catch (error) {
//             console.error('❌ Add record error:', error);
//             setError(error.response?.data?.message || 'Failed to add record');
//             return null;
//         }
//     };

//     // ============================================================
//     // APPOINTMENT ACTIONS
//     // ============================================================

//     const bookAppointment = async (appData) => {
//         try {
//             setError(null);
//             console.log('📅 Booking appointment:', appData);
            
//             const data = await appointmentService.create(appData);
            
//             if (data.success) {
//                 await refreshData();
//                 return data.appointment;
//             }
            
//             setError(data.message || 'Failed to book appointment');
//             return null;
//         } catch (error) {
//             console.error('❌ Book appointment error:', error);
//             setError(error.response?.data?.message || 'Failed to book appointment');
//             return null;
//         }
//     };

//     const updateAppointmentStatus = async (id, status) => {
//         try {
//             setError(null);
//             console.log('🔄 Updating appointment status:', { id, status });
            
//             const data = await appointmentService.updateStatus(id, status);
            
//             if (data.success) {
//                 await refreshData();
//                 return true;
//             }
            
//             setError(data.message || 'Failed to update appointment');
//             return false;
//         } catch (error) {
//             console.error('❌ Update appointment error:', error);
//             setError(error.response?.data?.message || 'Failed to update appointment');
//             return false;
//         }
//     };

//     // ============================================================
//     // STATS
//     // ============================================================

//     const getStats = () => {
//     return {
//         patients: patients.length,
//         doctors: doctors.length,
//         employees: employees.length,
//         records: records.length,
//         appointments: appointments.length
//     };
// };
//     return (
//         <AppContext.Provider value={{
//             doctors,
//             patients,
//             employees,
//             records,
//             appointments,
//             session,
//             loading,
//             error,
//             login,
//             logout,
//             registerPatient,
//             addPatient,
//             deletePatient,
//             updatePatientProfile,
//             addDoctor,
//             deleteDoctor,
//             addRecord,
//             bookAppointment,
//             updateAppointmentStatus,
//             getStats,
//             refreshData,
//             clearError: () => setError(null)
//         }}>
//             {children}
//         </AppContext.Provider>
//     );
// };



