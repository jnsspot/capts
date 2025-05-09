import { auth, db } from '../../firebase/firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signOut: jest.fn(),
  getAuth: jest.fn()
}));

// Mock Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  getFirestore: jest.fn()
}));

describe('Authentication System Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Login Tests
  describe('Login Functionality', () => {
    test('should successfully login with valid credentials', async () => {
      const mockUser = {
        uid: '123',
        email: 'test@example.com',
        emailVerified: true
      };

      signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ role: 'customer' })
      });

      const result = await loginUser('test@example.com', 'password123');
      expect(result).toBe('customer');
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
    });

    test('should fail login with invalid credentials', async () => {
      signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(loginUser('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    test('should fail login with unverified email', async () => {
      const mockUser = {
        uid: '123',
        email: 'test@example.com',
        emailVerified: false
      };

      signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

      await expect(loginUser('test@example.com', 'password123')).rejects.toThrow('Please verify your email before logging in.');
    });
  });

  // Registration Tests
  describe('Registration Functionality', () => {
    test('should successfully register a new user', async () => {
      const mockUser = {
        uid: '123',
        email: 'newuser@example.com'
      };

      createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
      setDoc.mockResolvedValueOnce();

      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'customer'
      };

      await registerUser(userData);
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'newuser@example.com',
        'password123'
      );
      expect(setDoc).toHaveBeenCalled();
    });

    test('should fail registration with existing email', async () => {
      createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Email already in use'));

      const userData = {
        email: 'existing@example.com',
        password: 'password123'
      };

      await expect(registerUser(userData)).rejects.toThrow('Email already in use');
    });
  });

  // Password Reset Tests
  describe('Password Reset Functionality', () => {
    test('should successfully send password reset email', async () => {
      sendPasswordResetEmail.mockResolvedValueOnce();

      await resetPassword('test@example.com');
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        auth,
        'test@example.com'
      );
    });

    test('should fail password reset with invalid email', async () => {
      sendPasswordResetEmail.mockRejectedValueOnce(new Error('Invalid email'));

      await expect(resetPassword('invalid-email')).rejects.toThrow('Invalid email');
    });
  });

  // Logout Tests
  describe('Logout Functionality', () => {
    test('should successfully logout user', async () => {
      signOut.mockResolvedValueOnce();

      await logoutUser();
      expect(signOut).toHaveBeenCalledWith(auth);
    });
  });

  // Session Management Tests
  describe('Session Management', () => {
    test('should maintain session after page reload', async () => {
      const mockUser = {
        uid: '123',
        email: 'test@example.com'
      };

      // Simulate user being logged in
      auth.currentUser = mockUser;
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ role: 'customer' })
      });

      const session = await checkSession();
      expect(session).toBeTruthy();
      expect(session.role).toBe('customer');
    });

    test('should clear session on logout', async () => {
      signOut.mockResolvedValueOnce();

      await logoutUser();
      const session = await checkSession();
      expect(session).toBeFalsy();
    });
  });
}); 