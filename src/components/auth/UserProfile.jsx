import React from "react";

const UserProfile = ({user}) => {

    

    const fullName =
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        "Zeni User";

    return (
        

        <div style={styles.page}>

            <div style={styles.profileCard}>

                {/* Top Section */}
                <div style={styles.header}>

                    <div style={styles.imageWrapper}>

                        <img
                            src="https://ui-avatars.com/api/?name=Zeni+User&background=111827&color=ffffff&size=256"
                            alt="Profile"
                            style={styles.profileImage}
                        />

                        <div style={styles.onlineIndicator}></div>

                    </div>

                    <div style={styles.headerInfo}>

                        <h1 style={styles.name}>
                            {fullName}
                        </h1>

                        <p style={styles.email}>
                            {user.email}
                        </p>

                        <span style={styles.userId}>
                            User ID: #{user.id}
                        </span>

                    </div>

                </div>

                {/* Details */}
                <div style={styles.detailsSection}>

                    <div style={styles.detailCard}>
                        <span style={styles.label}>
                            First Name
                        </span>

                        <span style={styles.value}>
                            {user.first_name || "Not provided"}
                        </span>
                    </div>

                    <div style={styles.detailCard}>
                        <span style={styles.label}>
                            Last Name
                        </span>

                        <span style={styles.value}>
                            {user.last_name || "Not provided"}
                        </span>
                    </div>

                    <div style={styles.detailCard}>
                        <span style={styles.label}>
                            Email Address
                        </span>

                        <span style={styles.value}>
                            {user.email}
                        </span>
                    </div>

                    <div style={styles.detailCard}>
                        <span style={styles.label}>
                            Account ID
                        </span>

                        <span style={styles.value}>
                            #{user.id}
                        </span>
                    </div>

                </div>

                {/* Action Buttons */}
                <div style={styles.actions}>

                    <button style={styles.primaryButton}>
                        Edit Profile
                    </button>

                    {/* <button style={styles.secondaryButton}>
                        Account Settings
                    </button> */}

                </div>

            </div>

        </div>
    );
};

const styles = {

    page: {
        minHeight: "100vh",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        padding: "24px",

        background:
            "linear-gradient(135deg, #0f172a, #111827)"
    },

    profileCard: {
        width: "100%",
        maxWidth: "850px",

        background: "rgba(255,255,255,0.04)",

        border: "1px solid rgba(255,255,255,0.08)",

        borderRadius: "28px",

        padding: "32px",

        backdropFilter: "blur(18px)",

        boxShadow:
            "0 20px 50px rgba(0,0,0,0.35)"
    },

    header: {
        display: "flex",
        alignItems: "center",
        gap: "28px",

        flexWrap: "wrap",

        marginBottom: "32px"
    },

    imageWrapper: {
        position: "relative"
    },

    profileImage: {
        width: "140px",
        height: "140px",

        borderRadius: "50%",

        objectFit: "cover",

        border: "4px solid rgba(255,255,255,0.08)"
    },

    onlineIndicator: {
        position: "absolute",
        bottom: "10px",
        right: "10px",

        width: "18px",
        height: "18px",

        borderRadius: "50%",

        background: "#22c55e",

        border: "3px solid #111827"
    },

    headerInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    name: {
        margin: 0,

        color: "#fff",

        fontSize: "32px",

        fontWeight: "700"
    },

    email: {
        margin: 0,

        color: "#94a3b8",

        fontSize: "16px"
    },

    userId: {
        width: "fit-content",

        background: "rgba(59,130,246,0.12)",

        color: "#60a5fa",

        padding: "8px 14px",

        borderRadius: "999px",

        fontSize: "13px",

        fontWeight: "600"
    },

    detailsSection: {
        display: "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

        gap: "18px",

        marginBottom: "32px"
    },

    detailCard: {
        background: "rgba(255,255,255,0.03)",

        border: "1px solid rgba(255,255,255,0.05)",

        borderRadius: "18px",

        padding: "20px",

        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    label: {
        color: "#64748b",

        fontSize: "13px",

        textTransform: "uppercase",

        letterSpacing: "1px",

        fontWeight: "600"
    },

    value: {
        color: "#fff",

        fontSize: "16px",

        fontWeight: "500"
    },

    actions: {
        display: "flex",

        gap: "16px",

        flexWrap: "wrap"
    },

    primaryButton: {
        background:
            "linear-gradient(135deg, #3b82f6, #2563eb)",

        color: "#fff",

        border: "none",

        padding: "14px 22px",

        borderRadius: "14px",

        fontSize: "14px",

        fontWeight: "600",

        cursor: "pointer"
    },

    secondaryButton: {
        background: "rgba(255,255,255,0.04)",

        color: "#fff",

        border: "1px solid rgba(255,255,255,0.08)",

        padding: "14px 22px",

        borderRadius: "14px",

        fontSize: "14px",

        fontWeight: "600",

        cursor: "pointer"
    }
};

export default UserProfile;