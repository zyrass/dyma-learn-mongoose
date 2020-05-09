require('colors');
const mongoose = require('mongoose');

/**
 * ---------------------------------------------------------------------
 * Author Schema
 * Author Schema.pre('save') - Incrémentera automatiquement l'index
 * Author Model (collection à part)
 * ---------------------------------------------------------------------
 */
const authorSchema = mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
			index: true,
			minLength: 3,
			maxLength: 20
		},
		lastname: {
			type: String,
			required: true,
			index: true,
			minLength: 3,
			maxLength: 25
		},
		index: Number
	},
	{
		timestamps: true
	}
);
authorSchema.pre('save', function() {
	return Authors.countDocuments().exec().then((currentAuthorIndex) => {
		this.index = currentAuthorIndex + 1;
	});
});
const Authors = mongoose.model('authors', authorSchema);

/**
 * ---------------------------------------------------------------------
 * Editor Schema
 * Editor Schema Pre('save') - Incrémentera automatiquement l'index
 * Editor Model (collection à part)
 * ---------------------------------------------------------------------
 */
const editorSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			index: true,
			minLength: 5,
			maxLength: 25
		},
		index: Number
	},
	{
		timestamps: true
	}
);
editorSchema.pre('save', function() {
	return Editors.countDocuments().exec().then((currentEditorIndex) => {
		this.index = currentEditorIndex + 1;
	});
});
const Editors = mongoose.model('editors', editorSchema);

/**
 * ---------------------------------------------------------------------
 * Books Schema
 * Books Schema.pre('save') - Incrémentera automatiquement l'index
 * Books Model (collection à part)
 * ---------------------------------------------------------------------
 */
const bookSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			index: true,
			minLength: 8,
			maxLength: 255
		},
		index: Number,
		info: {
			color: Boolean,
			pages: { type: Number, default: 1 },
			chapters: { type: Number, default: 1 },
			genre: { type: String, default: 'Developpeur Web' }
		},
		editor_id: { type: mongoose.Types.ObjectId, required: true, ref: 'editors' },
		author_id: { type: mongoose.Types.ObjectId, required: false, ref: 'authors' }
	},
	{
		timestamps: true
	}
);
bookSchema.pre('save', function() {
	return Books.countDocuments().exec().then((currentBookIndex) => {
		this.index = currentBookIndex + 1;
	});
});
const Books = mongoose.model('books', bookSchema);

/**
 * ---------------------------------------------------------------------
 * Connexion à MongoDB
 * ---------------------------------------------------------------------
 */
mongoose
	.connect('mongodb://zyrass:eronaele@localhost:27017/livres?authSource=admin', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	})
	.then(() => {
		// Test de connexion
		console.log('----------------------------------------------------------------------------------'.brightMagenta);
		console.log('\t👌 - La connexion au serveur a bien été établie avec succès - 👌'.brightMagenta);
		console.log('----------------------------------------------------------------------------------'.brightMagenta);

		showAuthors = () => {
			console.log(
				`
                               AAA                                          tttt          hhhhhhh 
                              A:::A                                      ttt:::t          h:::::h 
                             A:::::A                                     t:::::t          h:::::h
                            A:::::::A                                    t:::::t          h:::::h 
                           A:::::::::A           uuuuuu    uuuuuu  ttttttt:::::ttttttt     h::::h hhhhh          ooooooooooo   rrrrr   rrrrrrrrr       ssssssssss 
                          A:::::A:::::A          u::::u    u::::u  t:::::::::::::::::t     h::::hh:::::hhh     oo:::::::::::oo r::::rrr:::::::::r    ss::::::::::s
                         A:::::A A:::::A         u::::u    u::::u  t:::::::::::::::::t     h::::::::::::::hh  o:::::::::::::::or:::::::::::::::::r ss:::::::::::::s
                        A:::::A   A:::::A        u::::u    u::::u  tttttt:::::::tttttt     h:::::::hhh::::::h o:::::ooooo:::::orr::::::rrrrr::::::rs::::::ssss:::::s
                       A:::::A     A:::::A       u::::u    u::::u        t:::::t           h::::::h   h::::::ho::::o     o::::o r:::::r     r:::::r s:::::s  ssssss
                      A:::::AAAAAAAAA:::::A      u::::u    u::::u        t:::::t           h:::::h     h:::::ho::::o     o::::o r:::::r     rrrrrrr   s::::::s 
                     A:::::::::::::::::::::A     u::::u    u::::u        t:::::t           h:::::h     h:::::ho::::o     o::::o r:::::r                  s::::::s
                    A:::::AAAAAAAAAAAAA:::::A    u:::::uuuu:::::u        t:::::t    tttttt h:::::h     h:::::ho::::o     o::::o r:::::r            ssssss   s:::::s
                   A:::::A             A:::::A   u:::::::::::::::uu      t::::::tttt:::::t h:::::h     h:::::ho:::::ooooo:::::o r:::::r            s:::::ssss::::::s
                  A:::::A               A:::::A   u:::::::::::::::u      tt::::::::::::::t h:::::h     h:::::ho:::::::::::::::o r:::::r            s::::::::::::::s
                 A:::::A                 A:::::A   uu::::::::uu:::u        tt:::::::::::tt h:::::h     h:::::h oo:::::::::::oo  r:::::r             s:::::::::::s
                AAAAAAA                   AAAAAAA    uuuuuuuu  uuuu          ttttttttttt   hhhhhhh     hhhhhhh   ooooooooooo    rrrrrrr              sssssssssss
                `.brightBlue
			);
		};

		/**
         * ----------------------------------------------------------------------------------------
         * CREATE
         * ----------------------------------------------------------------------------------------
         *          Je fais une vérification du document si il est existant ou non.
         *          Si, ma vérification est supérieur à 0, alors j'affiche un message d'erreur.
         *          Sinon j'enregistre dans la base de donnée avec un new Authors.
         * ----------------------------------------------------------------------------------------
         **/
		// Authors.countDocuments(
		// 	{
		// 		firstname: 'Alain',
		// 		lastname: 'Guillon'
		// 	},
		// 	(err, compteur) => {
		// 		if (err) throw err;
		// 		const searchData = { firstname: 'Alain', lastname: 'Guillon' };
		// 		if (compteur > 0) {
		// 			switch (compteur) {
		// 				case 0:
		// 					break;
		// 				case 1:
		// 					console.log(
		// 						' ℹ'.brightCyan,
		// 						'- Il y a une correspondance avec ce nom et prénom.'.italic.brightCyan
		// 					);
		// 					break;
		// 				default:
		// 					console.log(
		// 						' ℹ'.brightCyan,
		// 						`- Il y a ${compteur} correspondances avec ce nom et prénom.`.italic.brightCyan
		// 					);
		// 					break;
		// 			}
		// 			console.log(
		// 				'❌ - Création impossible (Authors) :'.bold.brightRed,
		// 				`${searchData.firstname} ${searchData.lastname} existe déjà.`.red
		// 			);
		// 		} else {
		// 			const newAuthor = new Authors({
		// 				firstname: searchData.firstname,
		// 				lastname: searchData.lastname
		// 			});
		// 			newAuthor.save().then((result) => {
		// 				console.log(
		// 					`✅ - ${result.firstname} ${result.lastname} à bien été enregistré!`.bold.brightGreen
		// 				);
		// 			});
		// 		}
		// 	}
		// );

		/**
         * READ ALL
         * ------------------------------------------------------------------------------------------------
         * J'effectue une recherche sur le nombre de document existant dans la base de donnée.
         * Si le résultat est positif alors j'affiche la liste de tous les auteurs enregistrés.
         * Sinon j'affiche un message comme quoi il n'y a aucune liste à afficher.
         **/
		Authors.countDocuments({}, (err, compteur) => {
			if (err) throw err;
			if (compteur > 0) {
				Authors.find({})
					.select('-__v')
					.exec()
					.then((docs) => {
						switch (compteur) {
							case 1:
								console.log(
									' ℹ'.brightCyan,
									`- Il y a ${compteur} auteur d'enregistré dans la base de donnée :`.italic
										.brightCyan
								);
								showAuthors();
								break;
							default:
								console.log(
									' ℹ'.brightCyan,
									`- Il y a ${compteur} auteurs d'enregistrés dans la base de donnée :`.italic
										.brightCyan
								);
								showAuthors();
								break;
						}
						console.log('✅ - Liste des auteurs enregistrés dans la base de donnée : 👇'.bold.brightGreen);
						console.log(docs);
					})
					.catch((err) => console.error(err));
			} else {
				console.log("❌ - Aucun auteur n'est enregistré, la liste est vide.".bold.brightRed);
			}
		});

		/**
         * UPDATE
         * ------------------------------------------------------------------------------------------------
         * 1 - Je recherche si un Nom et Prénom match avec la base de donnée.
         * 2 - Si ça match j'effectue les modifications.
         * 3 - Sinon, j'affiche un message comme quoi il n'y a eu aucune modification
         **/
		// Authors.countDocuments({ lastname: 'Dyma' }, (err, compteur) => {
		// 	if (err) throw err;
		// 	if (compteur > 0) {
		// 		Authors.updateOne(
		// 			{ _id: '5eb5a5de7e3c36f3101ef1db' },
		// 			{
		// 				$set: {
		// 					firstname: 'Nick',
		// 					lastname: 'Morgan'
		// 				}
		// 			},
		// 			{
		// 				upsert: true,
		// 				new: true
		// 			}
		// 		)
		// 			.exec()
		// 			.then(() => {
		// 				console.log(`✅ - La mise à jour de l'auteur a bien été effectué.`.bold.brightGreen);
		// 			})
		// 			.catch((err) => console.error(err));
		// 	} else {
		// 		console.log(
		// 			'❌ - Modification impossible (Authors) :'.bold.brightRed,
		// 			'Aucune correspondance de trouvé avec le nom saisie.'.italic.red
		// 		);
		// 	}
		// });

		/**
         * DELETE - Ok
         * ------------------------------------------------------------------------------------------------
         * 1 - Je recherche si un Nom et Prénom match avec la base de donnée.
         * 2 - Si ça match je renvoie un message comme quoi la suppression à été effectué.
         * 3 - Sinon, j'affiche un message comme quoi cet auteur n'existe pas
         **/
		// deleteOneAuthor = () => {
		// 	Authors.deleteOne({
		// 		firstname: 'Alain',
		// 		lastname: 'Guillon'
		// 	})
		// 		.exec()
		// 		.then((doc) => {
		// 			console.log(`✅ - Suppression réussi avec succès!`.bold.brightGreen);
		// 		})
		// 		.catch((err) => console.error(err));
		// };

		// Authors.countDocuments(
		// 	{
		// 		firstname: 'Alain',
		// 		lastname: 'Guillon'
		// 	},
		// 	(err, compteur) => {
		// 		if (err) throw err;
		// 		if (compteur > 0) {
		// 			switch (compteur) {
		// 				case 1:
		// 					console.log(
		// 						' ℹ'.brightCyan,
		// 						`- Il y a ${compteur} correspondance à supprimer!`.bold.brightCyan
		// 					);
		// 					deleteOneAuthor();
		// 					break;
		// 				default:
		// 					console.log(
		// 						' ℹ'.brightCyan,
		// 						`- Il y a ${compteur} correspondances à supprimer!`.bold.brightCyan
		// 					);
		// 					deleteOneAuthor();
		// 					break;
		// 			}
		// 		} else {
		// 			console.log(
		// 				'❌ - Suppression impossible (Authors) :'.bold.brightRed,
		// 				'Aucune correspondance de trouvé.'.italic.red
		// 			);
		// 		}
		// 	}
		// );

		showEditors = () => {
			console.log(
				`
                    EEEEEEEEEEEEEEEEEEEEEE              d::::::d  iiiii            tttt                                                                
                    E::::::::::::::::::::E              d::::::d i:::::i        ttt:::t                                                                
                    E::::::::::::::::::::E              d::::::d  iiiii         t:::::t                                                                
                    EE::::::EEEEEEEEE::::E              d:::::d                 t:::::t                                                                
                        E:::::E     EEEEEE      ddddddddd:::::d  iiiiiii ttttttt:::::ttttttt        ooooooooooo    rrrrr   rrrrrrrrr       ssssssssss   
                        E:::::E               dd::::::::::::::d  i:::::i t:::::::::::::::::t      oo:::::::::::oo  r::::rrr:::::::::r    ss::::::::::s  
                        E::::::EEEEEEEEEE    d::::::::::::::::d   i::::i t:::::::::::::::::t     o:::::::::::::::o r:::::::::::::::::r  ss:::::::::::::s 
                        E:::::::::::::::E   d:::::::ddddd:::::d   i::::i tttttt:::::::tttttt     o:::::ooooo:::::o rr::::::rrrrr::::::r s::::::ssss:::::s
                        E:::::::::::::::E   d::::::d    d:::::d   i::::i       t:::::t           o::::o     o::::o  r:::::r     r:::::r  s:::::s  ssssss 
                        E::::::EEEEEEEEEE   d:::::d     d:::::d   i::::i       t:::::t           o::::o     o::::o  r:::::r     rrrrrrr    s::::::s      
                        E:::::E             d:::::d     d:::::d   i::::i       t:::::t           o::::o     o::::o  r:::::r                   s::::::s   
                        E:::::E     EEEEEE  d:::::d     d:::::d   i::::i       t:::::t    tttttt o::::o     o::::o  r:::::r             ssssss   s:::::s 
                    EE::::::EEEEEEEE:::::E  d::::::ddddd::::::d   i::::i       t::::::tttt:::::t o:::::ooooo:::::o  r:::::r             s:::::ssss::::::s
                    E::::::::::::::::::::E  d:::::::::::::::::d   i::::i       tt::::::::::::::t  o::::::::::::::o  r:::::r             s::::::::::::::s 
                    E::::::::::::::::::::E  d::::::::::::::::d    i:::::i       tt:::::::::::tt    oo::::::::::oo   r:::::r              s:::::::::::ss  
                    EEEEEEEEEEEEEEEEEEEEEE   dddddddddddddddd     iiiiiii         ttttttttttt        ooooooooooo    rrrrrrr               sssssssssss
                `.brightYellow
			);
		};

		/**
         * ----------------------------------------------------------------------------------------
         * CREATE
         * ----------------------------------------------------------------------------------------
         *          Je fais une vérification du document si il est existant ou non.
         *          Si, ma vérification est supérieur à 0, alors j'affiche un message d'erreur.
         *          Sinon j'enregistre dans la base de donnée avec un new Authors.
         * ----------------------------------------------------------------------------------------
         **/
		// Editors.countDocuments({ name: 'Eyrolles' }, (err, compteur) => {
		// 	if (err) throw err;
		// 	if (compteur > 0) {
		// 		const futurEditor = { name: 'Eyrolles' };
		// 		switch (compteur) {
		// 			case 0:
		// 				break;
		// 			case 1:
		// 				console.log(
		// 					' ℹ'.brightCyan,
		// 					'- Il y a une correspondance dans la base de donnée.'.italic.brightCyan
		// 				);
		// 				break;
		// 			default:
		// 				console.log(
		// 					' ℹ'.brightCyan,
		// 					`- Il y a ${compteur} correspondances dans la base de donnée.`.italic.brightCyan
		// 				);
		// 				break;
		// 		}
		// 		console.log('❌ - Création impossible (Editors) :'.bold.brightRed, `${futurEditor.name} existe déjà.`.red);
		// 	} else {
		// 		Editors.create({
		// 			name: 'Eyrolles'
		// 		}).then((result) => {
		// 			console.log(`✅ - ${result.name} à bien été enregistré!`.bold.brightGreen);
		// 		});
		// 	}
		// });

		/**
         * READ ALL
         * ------------------------------------------------------------------------------------------------
         * J'effectue une recherche sur le nombre de document existant dans la base de donnée.
         * Si le résultat est positif alors j'affiche la liste de tous les auteurs enregistrés.
         * Sinon j'affiche un message comme quoi il n'y a aucune liste à afficher.
         **/
		Editors.countDocuments({}, (err, compteur) => {
			if (err) throw err;
			if (compteur > 0) {
				switch (compteur) {
					case 1:
						console.log(
							' ℹ'.brightCyan,
							'- Il y a une correspondance pour les éditeurs dans la base de donnée :'.italic.brightCyan
						);
						break;
					default:
						console.log(
							' ℹ'.brightCyan,
							`- Il y a ${compteur} correspondances pour les éditeurs dans la base de donnée :`.italic
								.brightCyan
						);
						break;
				}

				Editors.find({})
					.select('-__v')
					.exec()
					.then((docs) => {
						showEditors();
						console.log('✅ - Liste des éditeurs enregistrés dans la base de donnée : 👇'.bold.brightGreen);
						console.log(docs);
					})
					.catch((err) => console.error(err));
			} else {
				console.log("❌ - Aucun auteur n'est enregistré, la liste est vide.".bold.brightRed);
			}
		});

		/**
         * UPDATE
         * ------------------------------------------------------------------------------------------------
         * 1 - Je recherche si un Nom et Prénom match avec la base de donnée.
         * 2 - Si ça match j'effectue les modifications.
         * 3 - Sinon, j'affiche un message comme quoi il n'y a eu aucune modification
         **/
		// Editors.countDocuments({ name: 'Eyrolle' }, (err, compteur) => {
		// 	if (err) throw err;
		// 	if (compteur > 0) {
		// 		Editors.updateOne(
		// 			{ name: 'Eyrolle' },
		// 			{
		// 				$set: { name: 'Eyrolles' }
		// 			},
		// 			{
		// 				upsert: true,
		// 				new: true
		// 			}
		// 		)
		// 			.exec()
		// 			.then(() => {
		// 				console.log(`✅ - La mise à jour de l'éditeur a bien été effectué.`.bold.brightGreen);
		// 			})
		// 			.catch();
		// 	} else {
		// 		console.log(
		// 			'❌ - Modification impossible (Editors) :'.bold.brightRed,
		// 			'Aucune correspondance de trouvé avec le nom saisie.'.italic.red
		// 		);
		// 	}
		// });

		/**
         * DELETE - Ok
         * ------------------------------------------------------------------------------------------------
         * 1 - Je recherche si un Nom et Prénom match avec la base de donnée.
         * 2 - Si ça match je renvoie un message comme quoi la suppression à été effectué.
         * 3 - Sinon, j'affiche un message comme quoi cet auteur n'existe pas
         **/
		// Editors.countDocuments({ name: 'Eyrolles' }, (err, compteur) => {
		// 	if (err) throw err;

		// 	const searchEditor = { name: 'Eyrolles' };
		// 	if (compteur > 0) {
		// 		Editors.deleteOne({ name: 'Eyrolles' })
		// 			.exec()
		// 			.then(() => {
		// 				switch (compteur) {
		// 					case 1:
		// 						console.log(
		// 							' ℹ'.brightCyan,
		// 							'- Il y a une correspondance dans la base de donnée.'.italic.brightCyan
		// 						);
		// 						break;
		// 					default:
		// 						console.log(
		// 							' ℹ'.brightCyan,
		// 							`- Il y a ${compteur} correspondances dans la base de donnée.`.italic.brightCyan
		// 						);
		// 						break;
		// 				}
		// 				console.log(`✅ - Suppression réussi avec succès!`.bold.brightGreen);
		// 			})
		// 			.catch((err) => console.error(err));
		// 	} else {
		// 		console.log('❌ - Suppression impossible (Editors) :'.bold.brightRed, `${searchEditor.name} n'existe pas.`.red);
		// 	}
		// });

		showBooks = () => {
			console.log(
				`
                BBBBBBBBBBBBBBBBB                                      kkkkkkkkk                            
                B::::::::::::::::B                                     kk::::::k                            
                B::::::BBBBBB:::::B                                    kk::::::k                            
                BB:::::B     B:::::B                                   kk::::::k 
                 B::::B     B:::::B    ooooooooooo       ooooooooooo     k:::::k    kkkkkkk    ssssssssss   
                 B::::B     B:::::B  oo:::::::::::oo   oo:::::::::::oo   k:::::k   k:::::k   ss::::::::::s  
                 B::::BBBBBB:::::B   o:::::::::::::::o o:::::::::::::::o k:::::k  k:::::k  ss:::::::::::::s 
                 B:::::::::::::BB    o:::::ooooo:::::o o:::::ooooo:::::o k:::::k k:::::k   s::::::ssss:::::s
                 B::::BBBBBB:::::B   o::::o     o::::o o::::o     o::::o k::::::k:::::k     s:::::s  ssssss 
                 B::::B     B:::::B  o::::o     o::::o o::::o     o::::o k:::::::::::k        s::::::s      
                 B::::B     B:::::B  o::::o     o::::o o::::o     o::::o k:::::::::::k           s::::::s   
                 B::::B     B:::::B  o::::o     o::::o o::::o     o::::o k::::::k:::::k    ssssss   s:::::s 
                 B::::B     B:::::B  o::::o     o::::o o::::o     o::::o k::::::k:::::k    ssssss   s:::::s
                BB:::::BBBBBB::::::B o:::::ooooo:::::o o:::::ooooo:::::o k::::::k k:::::k   s:::::ssss::::::s
                B:::::::::::::::::B  o:::::::::::::::o o:::::::::::::::o k::::::k  k:::::k  s::::::::::::::s 
                B::::::::::::::::B    oo:::::::::::oo   oo:::::::::::oo  k::::::k   k:::::k  s:::::::::::ss
                BBBBBBBBBBBBBBBBB       ooooooooooo       ooooooooooo    kkkkkkkk    kkkkkkk  sssssssssss
                `.brightGreen
			);
		};

		/**
         * ----------------------------------------------------------------------------------------
         * CREATE
         * ----------------------------------------------------------------------------------------
         *          Je fais une vérification du document si il est existant ou non.
         *          Si, ma vérification est supérieur à 0, alors j'affiche un message d'erreur.
         *          Sinon j'enregistre dans la base de donnée avec un new Authors.
         * ----------------------------------------------------------------------------------------
         **/
		Books.countDocuments({ title: 'HTML 5 - Une référence pour le développeur web' }, (err, compteur) => {
			if (err) throw err;
			if (compteur > 0) {
				switch (compteur) {
					case 1:
						console.log(
							' ℹ'.brightCyan,
							'- Il y a une correspondance dans la base de donnée "books".'.italic.brightCyan
						);
						console.log(
							'❌ - Création impossible (Books) :'.bold.brightRed,
							'Ce livre a déjà été enrgistré dans la base de donnée.'.red
						);
						break;
					default:
						console.log(
							' ℹ'.brightCyan,
							`- Il y a ${compteur} correspondances dans la base de donnée "books".`.italic.brightCyan
						);
						console.log(
							'❌ - Création impossible (Books) :'.bold.brightRed,
							'Ce livre a déjà été enrgistré plusieurs fois dans la base de donnée.'.red
						);
						break;
				}
			} else {
				const eyrolles = new Editors();
				eyrolles._id = Editors.findOne({ name: 'Eyrolles' })
					.exec()
					.then((currentEditor) => {
						return currentEditor._id;
					})
					.catch((error) => console.error(error));
				eyrolles.save();

				const anAuthor = new Authors();
				anAuthor._id = Authors.findOne({ firstname: 'Rodolphe', lastname: 'Rimelé' })
					.exec()
					.then((currentAuthor) => {
						return currentAuthor._id;
					})
					.catch((error) => console.error(error));
				anAuthor.save();

				Books.create({
					title: 'HTML 5 - Une référence pour le développeur web',
					info: {
						color: true,
						pages: 603,
						chapters: 20
					},
					editor_id: eyrolles._id,
					author_id: anAuthor._id
				})
					.then(() => {
						console.log(`✅ - Livre ajouté avec succès!`.bold.brightGreen);
					})
					.catch((err) => console.error(err));
			}
		});

		/**
         * READ ALL
         * ------------------------------------------------------------------------------------------------
         * J'effectue une recherche sur le nombre de document existant dans la base de donnée.
         * Si le résultat est positif alors j'affiche la liste de tous les auteurs enregistrés.
         * Sinon j'affiche un message comme quoi il n'y a aucune liste à afficher.
         **/
		Books.countDocuments({}, (err, compteur) => {
			if (err) throw err;
			if (compteur > 0) {
				switch (compteur) {
					case 1:
						console.log(
							' ℹ'.brightCyan,
							'- Il y a une correspondance dans la base de donnée "books":'.italic.brightCyan
						);
						break;
					default:
						console.log(
							' ℹ'.brightCyan,
							`- Il y a ${compteur} correspondances dans la base de donnée "books":`.italic.brightCyan
						);
						break;
				}
				Books.find({})
					.select('-__v')
					.populate('editors')
					.populate('authors')
					.exec()
					.then((docs) => {
						showBooks();
						console.log('✅ - Liste des livres enregistrés dans la base de donnée : 👇'.bold.brightGreen);
						console.log(docs);
					})
					.catch((err) => console.error(err));
			} else {
				console.log("❌ - Désolé, aucun livre n'est enregistré dans la base de donnée.".bold.brightRed);
			}
		});

		/**
         * UPDATE
         * ------------------------------------------------------------------------------------------------
         * 1 - Je recherche si un Nom et Prénom match avec la base de donnée.
         * 2 - Si ça match j'effectue les modifications.
         * 3 - Sinon, j'affiche un message comme quoi il n'y a eu aucune modification
         **/

		/**
         * DELETE - Ok
         * ------------------------------------------------------------------------------------------------
         * 1 - Je recherche si un Nom et Prénom match avec la base de donnée.
         * 2 - Si ça match je renvoie un message comme quoi la suppression à été effectué.
         * 3 - Sinon, j'affiche un message comme quoi cet auteur n'existe pas
         **/
		Books.countDocuments({ title: 'Je suis un nouveau livre' }, (err, compteur) => {
			if (err) throw err;
			if (compteur > 0) {
				Books.deleteOne({ title: 'Je suis un nouveau livre' })
					.exec()
					.then(() =>
						console.log(
							`✅ - Le livre qui a été saisie a bien été supprimé de la base de donnée.`.bold.brightGreen
						)
					)
					.catch((err) => console.error(err));
			} else {
				console.log(
					'❌ - Suppression Impossible :'.bold.brightRed,
					'Le titre recherché ne correspond à aucun titre dans la base de donnée "books".'.red
				);
			}
		});
	});
