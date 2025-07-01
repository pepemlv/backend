import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, Mail, Phone, Lock, ArrowLeft, Globe2, MapPin } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Ensure this points to your initialized Firestore config

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      const userData = {
        fullname: name,
        email,
        phone,
        password, // NOTE: Store hashed password in production
        city,
        country,
      };

      await addDoc(collection(db, 'pmsStreamingUsers'), userData);
      alert('Compte créé avec succès !');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Film className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Créer un compte</h2>
          <p className="mt-2 text-muted-foreground">
            Inscrivez-vous pour accéder à tous nos contenus
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nom */}
            <InputField
              id="name"
              label="Nom complet"
              value={name}
              setValue={setName}
              icon={<User className="h-5 w-5 text-muted-foreground" />}
              placeholder="Votre nom complet"
              type="text"
            />

            {/* Email */}
            <InputField
              id="email"
              label="Email"
              value={email}
              setValue={setEmail}
              icon={<Mail className="h-5 w-5 text-muted-foreground" />}
              placeholder="Votre adresse email"
              type="email"
            />

            {/* Téléphone */}
            <InputField
              id="phone"
              label="Numéro de téléphone"
              value={phone}
              setValue={setPhone}
              icon={<Phone className="h-5 w-5 text-muted-foreground" />}
              placeholder="Ex: 243123456789"
              type="tel"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Utilisé pour les paiements Mobile Money
            </p>

           

            {/* Mot de passe */}
            <InputField
              id="password"
              label="Mot de passe"
              value={password}
              setValue={setPassword}
              icon={<Lock className="h-5 w-5 text-muted-foreground" />}
              placeholder="Créez un mot de passe"
              type="password"
              onBlur={validatePassword}
            />

            {/* Confirmer mot de passe */}
            <InputField
              id="confirmPassword"
              label="Confirmer le mot de passe"
              value={confirmPassword}
              setValue={setConfirmPassword}
              icon={<Lock className="h-5 w-5 text-muted-foreground" />}
              placeholder="Confirmez votre mot de passe"
              type="password"
              onBlur={validatePassword}
            />
             {/* Ville */}
            <InputField
              id="city"
              label="Ville"
              value={city}
              setValue={setCity}
              icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
              placeholder="Ville"
              type="text"
            />

            {/* Pays */}
            <InputField
              id="country"
              label="Pays"
              value={country}
              setValue={setCountry}
              icon={<Globe2 className="h-5 w-5 text-muted-foreground" />}
              placeholder="Pays"
              type="text"
            />

            {passwordError && (
              <p className="text-sm text-destructive mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Inscription en cours...' : "S'inscrire"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-primary hover:underline inline-flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable input field component
function InputField({
  id,
  label,
  value,
  setValue,
  icon,
  placeholder,
  type,
  onBlur,
}: {
  id: string;
  label: string;
  value: string;
  setValue: (v: string) => void;
  icon: JSX.Element;
  placeholder: string;
  type: string;
  onBlur?: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          name={id}
          type={type}
          required
          className="input pl-10"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}
