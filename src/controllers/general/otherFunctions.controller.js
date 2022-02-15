//OTHER FUNCTIONS
export function matchObjects(complements, assignedComplements) {
    let match = [];
    complements.map(complement => {
        let search = assignedComplements.find(assigned => assigned._id == complement._id);
        if (search) {
            complement.assigned = true;
        }
        match.push(complement);
    });
    return match;
}