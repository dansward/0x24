var config = {
		cssPath : '/0x24/css/',
		templatePath : '/0x24/templates/',
		providers : {
			large : {
				google : {
					name : 'Google',
				url : 'https://gmail.com/'
				},
				yahoo : {
					name : 'Yahoo',
					url : 'http://me.yahoo.com/'
				},
				aol : {
					name : 'AOL',
					label : 'Enter your AOL screenname',
					url : 'http://openid.aol.com/{username}'
				},
				myopenid : {
					name : 'MyOpenID',
					label : 'Enter your MyOpenID username',
					url : 'http://{username}.myopenid.com/'
				},
				openid : {
					name : 'OpenID',
					label : 'Enter your OpenID',
					url : null
				}
			},
			small : {
				winliveid : {
					name : 'Windows Live',
					label : 'Enter your Windows Live username',
					url : 'http://live.com/{username}/'
				},
				linkedin : {
					name : 'LinkedIn',
					label : 'Enter your LinkedIn username',
					url : 'http://linkedin.com/{username}/'
				},
				livejournal : {
					name : 'Live Journal',
					label : 'Enter your Livejournal username',
					url : 'http://{username}.livejournal.com/'
				},
				flickr : {
					name: 'Flickr',        
					label: 'Enter your Flickr username',
					url: 'http://flickr.com/{username}/'
				},
				twitter : {
					name: 'Twitter',        
					label: 'Enter your Twitter username',
					url: 'http://twitter.com/{username}/'
				},
				technorati : {
					name: 'Technorati',
					label: 'Enter your Technorati username',
					url: 'http://technorati.com/people/technorati/{username}/'
				},
				wordpress : {
					name : 'Wordpress',
					label : 'Enter your Wordpress.com username',
					url : 'http://{username}.wordpress.com/'
				},
				blogger : {
					name : 'Blogger',
					label : 'Enter your Blogger account',
					url : 'http://{username}.blogspot.com/'
				},
				verisign : {
					name : 'Verisign',
					label : 'Enter your Verisign username',
					url : 'http://{username}.pip.verisignlabs.com/'
				},
				vidoop : {
					name: 'Vidoop',
					label: 'Enter your Vidoop username',
					url: 'http://{username}.myvidoop.com/'
				},
				launchpad : {
					name: 'Launchpad',
					label: 'Enter your Launchpad username',
					url: 'https://launchpad.net/~{username}'
				},
				claimid : {
					name : 'ClaimID',
					label : 'Enter your ClaimID username',
					url : 'http://claimid.com/{username}'
				},
				clickpass : {
					name : 'ClickPass',
					label : 'Enter your ClickPass username',
					url : 'http://clickpass.com/public/{username}'
				}
			}
		}
	};