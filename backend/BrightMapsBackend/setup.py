from setuptools import find_packages, setup

setup(
    name='spa_server',
    version='0.1.0',
    author_email='abrahamuribejr@gmail.com',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'flask',
        'astral',
        'json',
        'requests',
        'datetime',
        'dateutil.tz',
        're',
        'backend_methods'
    ]
)