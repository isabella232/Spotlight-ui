import React from 'react'; // eslint-disable-line
import { Provider } from 'react-redux';
import store from '../redux/index';
import AvailableFields from '../components/modules/available-fields';
import SelectedFields from '../components/modules/selected-fields';

const styles = {
    main: {
        display: 'flex'
    },
    left: {
        position: 'fixed',
        overflow: 'auto',
        backgroundColor: '#ddd',
        width: '30%',
        height: '100vh',
        borderRight: '#ddd 1px solid',
    },
    right: {
        backgroundColor: 'white',
        flex: 1,
        marginLeft: '30%',
    }
}

const CsvBuilder = () => {
    return (
        <Provider store={store}>
            <main style={styles.main}>
                <div style={styles.left}>
                    <AvailableFields />
                </div>
                <div style={styles.right}>
                    <SelectedFields />
                </div>
            </main>
        </Provider>
    );
};

export default CsvBuilder;
