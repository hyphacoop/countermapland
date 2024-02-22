<script>
    import '../app.css';
    import { base } from '$app/paths';
</script>
<h1>*countermap</h1>
<ul>
    <li>
        <a href='{base}/map'>
            map
        </a>
    </li>
    <li>
        <a href='{base}/objects'>
            objects
        </a>
    </li>
</ul>

<style>
    ul {
        display: flex;
        gap: 1rem;
        align-items: center;
        justify-content: center;
        list-style-type: none;
        padding: 0;
        height: 100vh;
    }
    li {
        font-size: 2rem;
    }

    a:hover {
        text-decoration: underline;
    }
</style>