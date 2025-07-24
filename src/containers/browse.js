/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { FirebaseContext } from '../context/firebase';
import { SelectProfileContainer } from './profiles';
import { Header, Loading } from '../components';
import * as ROUTES from '../constants/routes';
import logo from '../logo.svg';

export function BrowseContainer({ slides = {} }) {
    const [category] = useState('series');
    const [searchTerm, setSearchTerm] = useState('');
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [slideRows, setSlideRows] = useState([]);

    const { firebase } = useContext(FirebaseContext);
    const user = firebase.auth().currentUser || {};

    // Simulate loading
    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timeout);
    }, [profile.displayName]);

    // Update slideRows on slides or category change
    useEffect(() => {
        if (slides && slides[category]) {
            setSlideRows(slides[category]);
        }
    }, [slides, category]);

    // Fuse.js search logic
    useEffect(() => {
        if (!searchTerm || searchTerm.length <= 3) {
            setSlideRows(slides[category] || []);
            return;
        }

        const fuse = new Fuse(slideRows, {
            keys: ['data.description', 'data.title', 'data.genre'],
        });

        const results = fuse.search(searchTerm).map(({ item }) => item);

        setSlideRows(results.length > 0 ? results : slides[category] || []);
    }, [searchTerm, slideRows, slides, category]);

    // If user profile is selected, show main screen
    return profile.displayName ? (
        <>
            {loading ? <Loading src={user.photoURL} /> : <Loading.ReleaseBody />}

            <Header>
                <Header.Frame>
                    <Header.Group>
                        <Header.Logo to={ROUTES.HOME} src={logo} alt="Netflix" />
                    </Header.Group>

                    <Header.Group>
                        <Header.Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <Header.Profile>
                            <Header.Picture src={user.photoURL} />
                            <Header.Dropdown>
                                <Header.Group>
                                    <Header.Picture src={user.photoURL} />
                                    <Header.TextLink>{user.displayName}</Header.TextLink>
                                </Header.Group>
                                <Header.Group>
                                    <Header.TextLink onClick={() => firebase.auth().signOut()}>
                                        Sign out
                                    </Header.TextLink>
                                </Header.Group>
                            </Header.Dropdown>
                        </Header.Profile>
                    </Header.Group>
                </Header.Frame>

                <Header.Banner />
            </Header>
        </>
    ) : (
        <SelectProfileContainer user={user} setProfile={setProfile} />
    );
}
