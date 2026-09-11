# Deploy on your Mac

1. Keep your safety branch:
   `backup/sakhi-v3-before-sync`
2. Extract the V3 ZIP outside the repo.
3. Make sure `/Users/vinaygovindam/Downloads/sakhi-learning` is on `upgrade/sakhi-v3` and clean.
4. Run the included installer with the repo path.
5. Run `npm run qa` and `npm run preview`.
6. Test Home, Reading, Math, Writing, wrong answers, Parent Dashboard, refresh, and audio.
7. Commit and push only after local testing.

If you want to deploy the RC as a totally separate GitHub project instead of overwriting the current branch, create a new empty repo and copy the extracted bundle into it; the included Pages workflow builds and publishes `dist/`.
