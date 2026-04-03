const LegalPage = () => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Informations Légales</h1>
        
        <div className="w-full">
          <div className="grid w-full grid-cols-2 mb-8">
            <button className="tab-trigger">Conditions d'Utilisation</button>
            <button className="tab-trigger">Politique de Confidentialité</button>
          </div>
          
          <div className="prose prose-lg text-gray-700 max-w-none">
            <h2 className="text-2xl font-semibold mt-2 mb-4">Conditions d'Utilisation</h2>
            <p className="mb-4">
              Bienvenue sur Elsaidaliya. En utilisant notre plateforme, vous acceptez ces conditions d'utilisation. 
              Veuillez les lire attentivement.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">1. Acceptation des Conditions</h3>
            <p className="mb-4">
              En accédant à ou en utilisant Elsaidaliya, vous acceptez d'être lié par ces Conditions. 
              Si vous n'acceptez pas ces Conditions, vous ne devez pas utiliser notre plateforme.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">2. Éligibilité</h3>
            <p className="mb-4">
              Pour utiliser notre plateforme, vous devez être un professionnel du secteur pharmaceutique en Algérie, 
              soit en tant que pharmacien, soit en tant que fournisseur. Vous devez être légalement autorisé à exercer 
              votre profession et posséder toutes les licences et autorisations requises par la loi algérienne.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">3. Inscription et Compte</h3>
            <p className="mb-4">
              Lors de l'inscription, vous devez fournir des informations exactes, complètes et à jour. Vous êtes responsable 
              du maintien de la confidentialité de votre compte et de votre mot de passe, et vous acceptez de ne pas partager 
              ces informations avec des tiers. Vous êtes entièrement responsable de toutes les activités qui se produisent sous votre compte.
            </p>
            <p className="mb-4">
              L'adresse email et le numéro de téléphone utilisés lors de l'inscription doivent être uniques et ne peuvent être 
              associés qu'à un seul compte.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">4. Contenu</h3>
            <p className="mb-4">
              Vous êtes responsable de tout contenu que vous publiez sur notre plateforme. Ce contenu ne doit pas être illégal, 
              trompeur, menaçant, diffamatoire, obscène, ou autrement répréhensible. Vous ne devez pas violer les droits de propriété 
              intellectuelle d'autrui.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">5. Propriété Intellectuelle</h3>
            <p className="mb-4">
              Tous les droits de propriété intellectuelle relatifs à notre plateforme et son contenu appartiennent à Elsaidaliya 
              ou à ses concédants de licence. Vous n'obtenez aucun droit de propriété sur notre plateforme ou son contenu.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">6. Limitation de Responsabilité</h3>
            <p className="mb-4">
              Elsaidaliya n'est pas responsable des transactions entre les utilisateurs de la plateforme. Nous agissons uniquement 
              comme intermédiaire pour faciliter les connexions entre pharmaciens et fournisseurs. Toute transaction, contrat ou accord 
              conclu entre utilisateurs est strictement entre ces utilisateurs, et Elsaidaliya n'est pas partie à ces accords.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">7. Résiliation</h3>
            <p className="mb-4">
              Nous pouvons suspendre ou résilier votre accès à notre plateforme à tout moment, pour quelque raison que ce soit, 
              sans préavis ni responsabilité.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">8. Modifications des Conditions</h3>
            <p className="mb-4">
              Nous pouvons modifier ces Conditions à tout moment. Les modifications prennent effet dès leur publication sur notre plateforme. 
              En continuant à utiliser notre plateforme après la publication des modifications, vous acceptez ces modifications.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">9. Loi Applicable</h3>
            <p className="mb-4">
              Ces Conditions sont régies et interprétées conformément aux lois de l'Algérie.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">10. Contact</h3>
            <p className="mb-4">
              Si vous avez des questions concernant ces Conditions, vous pouvez nous contacter à :
            </p>
            <p className="mb-8">
              Email : <a href="mailto:contact@elsaidaliya.com" className="text-[#2E7D32] hover:underline">contact@elsaidaliya.com</a>
              <br />
              Téléphone : +213 553 720 952
            </p>
          </div>
          
          <div className="prose prose-lg text-gray-700 max-w-none hidden">
            <h2 className="text-2xl font-semibold mt-2 mb-4">Politique de Confidentialité</h2>
            <p className="mb-4">
              Elsaidaliya s'engage à protéger votre vie privée. Cette politique de confidentialité décrit comment nous collectons, 
              utilisons et partageons vos informations personnelles lorsque vous utilisez notre plateforme.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Informations que nous collectons</h3>
            <p className="mb-4">
              Nous collectons les informations suivantes lorsque vous vous inscrivez sur notre plateforme :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Nom de votre entreprise</li>
              <li>Adresse email (à usage unique)</li>
              <li>Numéro de téléphone (à usage unique)</li>
              <li>Wilaya</li>
              <li>Image du registre de commerce</li>
              <li>Rôle (pharmacien ou fournisseur)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Comment nous utilisons vos informations</h3>
            <p className="mb-4">
              Nous utilisons les informations collectées pour :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Créer et gérer votre compte</li>
              <li>Fournir et améliorer nos services</li>
              <li>Communiquer avec vous concernant votre compte ou nos services</li>
              <li>Vous permettre de contacter d'autres utilisateurs de la plateforme</li>
              <li>Prévenir la fraude et assurer la sécurité de notre plateforme</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Partage de vos informations</h3>
            <p className="mb-4">
              Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager certaines informations avec :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>D'autres utilisateurs de la plateforme (uniquement les informations nécessaires pour faciliter les connexions entre pharmaciens et fournisseurs)</li>
              <li>Nos prestataires de services qui nous aident à exploiter notre plateforme</li>
              <li>Les autorités compétentes lorsque la loi l'exige</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Sécurité des données</h3>
            <p className="mb-4">
              Nous prenons des mesures techniques et organisationnelles pour protéger vos données personnelles contre tout accès non autorisé, 
              modification, divulgation ou destruction. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique 
              n'est totalement sécurisée, et nous ne pouvons garantir une sécurité absolue.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Vos droits</h3>
            <p className="mb-4">
              Vous avez le droit de :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Accéder aux données personnelles que nous détenons sur vous</li>
              <li>Rectifier ces données si elles sont inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Demander la limitation du traitement de vos données</li>
              <li>Demander la portabilité de vos données</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Modifications de notre politique de confidentialité</h3>
            <p className="mb-4">
              Nous pouvons modifier cette politique de confidentialité de temps à autre. Toute modification sera publiée sur cette page, 
              et nous vous en informerons par email si les modifications sont importantes.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Contact</h3>
            <p className="mb-8">
              Si vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter à :
              <br />
              Email : <a href="mailto:contact@elsaidaliya.com" className="text-[#2E7D32] hover:underline">contact@elsaidaliya.com</a>
              <br />
              Téléphone : +213 553 720 952
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;